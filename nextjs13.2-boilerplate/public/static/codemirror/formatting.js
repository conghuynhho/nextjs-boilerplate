/* eslint-disable */
// ============== Formatting extensions ============================
(function() {
  // Define extensions for a few modes
  CodeMirror.extendMode("css", {
    commentStart: "/*",
    commentEnd: "*/",
    wordWrapChars: [";", "\\{", "\\}"],
    autoFormatLineBreaks: function (text) {
      return text.replace(new RegExp("(;|\\{|\\})([^\r\n])", "g"), "$1\n$2")
    }
  })

  function jsNonBreakableBlocks(text) {
    let nonBreakableRegexes = [/for\s*?\((.*?)\)/,
      /\"(.*?)(\"|$)/,
      /\'(.*?)(\'|$)/,
      /\/\*(.*?)(\*\/|$)/,
      /\/\/.*/],
     nonBreakableBlocks = []
    for (let i = 0; i < nonBreakableRegexes.length; i++) {
      let curPos = 0
      while (curPos < text.length) {
        let m = text.substr(curPos).match(nonBreakableRegexes[i])
        if (m != null) {
          nonBreakableBlocks.push({
            start: curPos + m.index,
            end: curPos + m.index + m[0].length
          })
          curPos += m.index + Math.max(1, m[0].length)
        }
        else { // No more matches
          break
        }
      }
    }
    nonBreakableBlocks.sort(function (a, b) {
      return a.start - b.start
    })

    return nonBreakableBlocks
  }

  CodeMirror.extendMode("javascript", {
    commentStart: "/*",
    commentEnd: "*/",
    wordWrapChars: [";", "\\{", "\\}"],

    autoFormatLineBreaks: function (text) {
      let curPos = 0,
       split = this.jsonMode ? function(str) {
        return str.replace(/([,{])/g, "$1\n").replace(/}/g, "\n}")
      } : function(str) {
        return str.replace(/(;|\{|\})([^\r\n;])/g, "$1\n$2")
      },
       nonBreakableBlocks = jsNonBreakableBlocks(text), res = ""
      if (nonBreakableBlocks != null) {
        for (let i = 0; i < nonBreakableBlocks.length; i++) {
          if (nonBreakableBlocks[i].start > curPos) { // Break lines till the block
            res += split(text.substring(curPos, nonBreakableBlocks[i].start))
            curPos = nonBreakableBlocks[i].start
          }
          if (nonBreakableBlocks[i].start <= curPos
            && nonBreakableBlocks[i].end >= curPos) { // Skip non-breakable block
            res += text.substring(curPos, nonBreakableBlocks[i].end)
            curPos = nonBreakableBlocks[i].end
          }
        }
        if (curPos < text.length)
          res += split(text.substr(curPos))
      } else {
        res = split(text)
      }
      return res.replace(/^\n*|\n*$/, "")
    }
  })

  CodeMirror.extendMode("xml", {
    commentStart: "<!--",
    commentEnd: "-->",
    wordWrapChars: [">"],

    autoFormatLineBreaks: function (text) {
      let lines = text.split("\n"),
       reProcessedPortion = new RegExp("(^\\s*?<|^[^<]*?)(.+)(>\\s*?$|[^>]*?$)"),
       reOpenBrackets = new RegExp("<", "g"),
       reCloseBrackets = new RegExp("(>)([^\r\n])", "g")
      for (let i = 0; i < lines.length; i++) {
        let mToProcess = lines[i].match(reProcessedPortion)
        if (mToProcess != null && mToProcess.length > 3) { // The line starts with whitespaces and ends with whitespaces
          lines[i] = mToProcess[1]
            + mToProcess[2].replace(reOpenBrackets, "\n$&").replace(reCloseBrackets, "$1$2")
            + mToProcess[3]
          continue
        }
      }
      return lines.join("\n")
    }
  })

  function localModeAt(cm, pos) {
    return CodeMirror.innerMode(cm.getMode(), cm.getTokenAt(pos).state).mode
  }

  function enumerateModesBetween(cm, line, start, end) {
    let outer = cm.getMode(), text = cm.getLine(line)
    if (end == null) end = text.length
    if (!outer.innerMode) return [{from: start, to: end, mode: outer}]
    let state = cm.getTokenAt({line: line, ch: start}).state,
     mode = CodeMirror.innerMode(outer, state).mode,
     found = [], stream = new CodeMirror.StringStream(text)
    stream.pos = stream.start = start
    for (;;) {
      outer.token(stream, state)
      let curMode = CodeMirror.innerMode(outer, state).mode
      if (curMode != mode) {
        let cut = stream.start
        // Crappy heuristic to deal with the fact that a change in
        // mode can occur both at the end and the start of a token,
        // and we don't know which it was.
        if (mode.name == "xml" && text.charAt(stream.pos - 1) == ">") cut = stream.pos
        found.push({from: start, to: cut, mode: mode})
        start = cut
        mode = curMode
      }
      if (stream.pos >= end) break
      stream.start = stream.pos
    }
    if (start < end) found.push({from: start, to: end, mode: mode})
    return found
  }

  // Comment/uncomment the specified range
  CodeMirror.defineExtension("commentRange", function (isComment, from, to) {
    let curMode = localModeAt(this, from), cm = this
    this.operation(function() {
      if (isComment) { // Comment range
        cm.replaceRange(curMode.commentEnd, to)
        cm.replaceRange(curMode.commentStart, from)
        if (from.line == to.line && from.ch == to.ch) // An empty comment inserted - put cursor inside
          cm.setCursor(from.line, from.ch + curMode.commentStart.length)
      } else { // Uncomment range
        let selText = cm.getRange(from, to),
         startIndex = selText.indexOf(curMode.commentStart),
         endIndex = selText.lastIndexOf(curMode.commentEnd)
        if (startIndex > -1 && endIndex > -1 && endIndex > startIndex) {
          // Take string till comment start
          selText = selText.substr(0, startIndex)
            // From comment start till comment end
            + selText.substring(startIndex + curMode.commentStart.length, endIndex)
            // From comment end till string end
            + selText.substr(endIndex + curMode.commentEnd.length)
        }
        cm.replaceRange(selText, from, to)
      }
    })
  })

  // Applies automatic mode-aware indentation to the specified range
  CodeMirror.defineExtension("autoIndentRange", function (from, to) {
    let cmInstance = this
    this.operation(function () {
      for (let i = from.line; i <= to.line; i++) {
        cmInstance.indentLine(i, "smart")
      }
    })
  })

  // Applies automatic formatting to the specified range
  CodeMirror.defineExtension("autoFormatRange", function (from, to) {
    let cm = this
    cm.operation(function () {
      for (var cur = from.line, end = to.line; cur <= end; ++cur) {
        let f = {line: cur, ch: cur == from.line ? from.ch : 0},
         t = {line: cur, ch: cur == end ? to.ch : null},
         modes = enumerateModesBetween(cm, cur, f.ch, t.ch), mangled = "",
         text = cm.getRange(f, t)
        for (let i = 0; i < modes.length; ++i) {
          let part = modes.length > 1 ? text.slice(modes[i].from, modes[i].to) : text
          if (mangled) mangled += "\n"
          if (modes[i].mode.autoFormatLineBreaks) {
            mangled += modes[i].mode.autoFormatLineBreaks(part)
          } else mangled += text
        }
        if (mangled != text) {
          for (var count = 0, pos = mangled.indexOf("\n"); pos != -1; pos = mangled.indexOf("\n", pos + 1), ++count) {}
          cm.replaceRange(mangled, f, t)
          cur += count
          end += count
        }
      }
      for (var cur = from.line + 1; cur <= end; ++cur)
        cm.indentLine(cur, "smart")
      cm.setSelection(from, cm.getCursor(false))
    })
  })
})()
