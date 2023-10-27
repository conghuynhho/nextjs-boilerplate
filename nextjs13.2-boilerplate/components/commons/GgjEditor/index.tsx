import { memo, useEffect, useMemo, useState } from 'react'
import NoSsr from '@mui/material/NoSsr'
import {Initial, onAcceptFormatCode, destroyEditor, setEditorValue} from './configEditor'
import { useTranslation } from 'next-i18next'
export const nsTran = 'common@editor'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { css } from '@emotion/react'
import ImportHead from './head'

// TODO: Huynh handle security about external link

interface EditorProps {
  id: string
  accept?: string | null
  value?: string | null
  onChange?: (content: string) => void
  maxSize?: number | null
  maxFiles?: number | null
  maxLength?: number | null
  toolbar: (string | string[])[][]
}

const defaultEditorProps = {
  accept: '.png,.jpg,.jpeg,.bmp,.gif',
  maxSize: 10,
  maxFiles: 20,
  maxLength: 3000,
  toolbar: [
    ['mybutton', ['textMode', 'htmlMode']],
    ['style', ['style']],
    ['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
    ['fontname', ['fontname']],
    ['fontsize', ['fontsize']],
    ['color', ['color']],
    ['para', ['ul', 'ol', 'paragraph']],
    ['height', ['height']],
    ['table', ['table']],
    ['insert', ['link', 'picture', 'video', 'hr']],
    ['misc', ['undo', 'redo']],
    ['view', ['formatter']],
    ['countbutton', ['countText']],
  ],
}

interface PopupWarningExtensionProps {
  isShow: boolean
  accept?: string | null
  maxSize?: number | null
  closePopupWarningExtensions: () => void
  errorImgs: Array<{ name?: string; size?: string; extension?: string }>
}

function PopupWarningExtensions({
  isShow,
  accept,
  maxSize,
  closePopupWarningExtensions,
  errorImgs,
}: PopupWarningExtensionProps) {
  const { t } = useTranslation(nsTran)
  return (
    <Dialog open={isShow}>
      <div className="warning-limit mp-ds">
        <div
          className="modal-body text-center bg-warning-2"
          css={css`
            max-width: 600px;
          `}
        >
          <button
            type="button"
            className="close"
            onClick={closePopupWarningExtensions}
          >
            <span>&times;</span>
          </button>
          <div className="warning-ex">
            <span className="note">{t('Warning!')}</span>
            <span>{t('1', { accept: accept, size: maxSize })}</span>
            {errorImgs.length && (
              <>
                <div className="tbl-title">{t('2')}</div>
                <div className="scrollable">
                  <table>
                    <thead className="d-none d-sm-table-header-group">
                      <tr className="border-warning-2">
                        <th className="bg-warning-6">{t('3')}</th>
                        <th className="bg-warning-6">{t('4')}</th>
                        <th className="bg-warning-6">{t('5')}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-warning-4">
                      {errorImgs.map((p, index) => (
                        <tr key={'ext' + index} className="border-warning-2">
                          <td className="img-name text-truncate">{p.name}</td>
                          <td className="w-100 d-none d-sm-table-cell">
                            {p.size}
                          </td>
                          <td className="w-100 d-none d-sm-table-cell">
                            {p.extension}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

interface PopupFormatCodeProps {
  isShow: boolean
  handleSetIsShowPopupFormatCode: (isShow: boolean) => void
  handleAcceptFormatCode: () => void
}

function PopupFormatCode({
  isShow,
  handleSetIsShowPopupFormatCode,
  handleAcceptFormatCode,
}: PopupFormatCodeProps) {
  const { t } = useTranslation(nsTran)
  return (
    <Dialog open={isShow} onClose={() => handleSetIsShowPopupFormatCode(false)}>
      <DialogTitle>{t('6')}</DialogTitle>
      <DialogContent>
        <DialogContentText
          css={css`
            white-space: pre-line;
            color: red;
          `}
        >
          {t('7')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleSetIsShowPopupFormatCode(false)}>
          {t('8')}
        </Button>
        <Button onClick={handleAcceptFormatCode}>{t('9')}</Button>
      </DialogActions>
    </Dialog>
  )
}

function Editor({
  id,
  accept,
  value,
  onChange,
  maxSize,
  maxLength,
  toolbar
}: EditorProps) {
  const { t } = useTranslation(nsTran)
  const contentTextMode = t('10')
  const contentHTMLMode = t('11')
  const contentFormatButton = t('12')
  const contentTooltipFormatButton = t('13')
  const mode = 1
  const [snContext, setSnContext] = useState(null)
  const [isShowPopupFormatCode, setIsShowPopupFormatCode] = useState(false)
  const [isInitiated, setIsInitiated] = useState(false)
  //TODO: Thao, Need show Popup limit  upload images
  // const [isShowPopupWarningMaxFiles, setIsShowPopupWarningMaxFiles] =
  //   useState(false)
  const [isShowPopupWarningExtensions, setIsShowPopupWarningExtensions] =
    useState(false)
  const [errorImgs, setErrorImgs] = useState<
    Array<{ name?: string; size?: string; extension?: string }>
  >([])

  const handleSetContent = (content: string) => {
    onChange?.call(null, content)
  }
  const handleSetIsShowPopupFormatCode = (isShow: boolean) => {
    setIsShowPopupFormatCode(isShow)
  }
  const handleAcceptFormatCode = () => {
    setIsShowPopupFormatCode(false)
    onAcceptFormatCode(id, snContext)
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handleSetSnContext = (context: any) => {
    setSnContext(context)
  }
  const closePopupWarningExtensions = () => {
    setIsShowPopupWarningExtensions(false)
    setErrorImgs([])
  }

  //Note: Initial
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const idInterval = setInterval(()=>{
        //@ts-ignore
        if(typeof(window.$)  !== 'undefined' && typeof(window.$.summernote)  === 'object')
        {
          Initial({
            id,
            mode,
            accept,
            handleSetContent,
            handleSetIsShowPopupFormatCode,
            handleSetSnContext,
            content: value,
            maxLength,
            contentTextMode,
            contentHTMLMode,
            contentFormatButton,
            contentTooltipFormatButton,
            toolbar
          })
          clearInterval(idInterval)
          setIsInitiated(true)
        }
      },600)
    }
    return destroyEditor()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if(value && isInitiated) {
      setEditorValue(id, value)
    }
  }, [value, isInitiated])


  return (
    <div
      id={`simple-editor-${id}`}
      className="simple-editor summer-note-editor border-radius-10"
      data-id={id}
    >
      <div className="flex flex-column">
        <div
          className="bg-white article-editor mp-ds hide-scrollbar pos-rel"
          style={{ position: 'relative', paddingTop: 0, width: '100%' }}
        >
          <div id={id}></div>
        </div>
      </div>
      <PopupFormatCode
        isShow={isShowPopupFormatCode}
        handleSetIsShowPopupFormatCode={handleSetIsShowPopupFormatCode}
        handleAcceptFormatCode={handleAcceptFormatCode}
      />
      <PopupWarningExtensions
        isShow={isShowPopupWarningExtensions}
        errorImgs={errorImgs}
        closePopupWarningExtensions={closePopupWarningExtensions}
        accept={accept}
        maxSize={maxSize}
      />
    </div>
  )
}
Editor.defaultProps = defaultEditorProps
const EditorMemo = memo(Editor)

interface GgjEditorProps {
  accept?: string | null
  value?: string | null
  onChange?: (content: string) => void
  maxSize?: number | null
  maxFiles?: number | null
  maxLength?: number | null
  toolbar?:  (string | string[])[][],
  id?: string
}

export const GgjEditor = memo(function GgjEditor(props: GgjEditorProps) {
  const id = useMemo(
    () =>
      (props.id || 'summernote' + +new Date() + ((Math.random() * 10000).toFixed(0) + '')),
    [props.id]
  )

  const isUseCodeMirror = useMemo(()=>{
    if(props.toolbar && props.toolbar.length)
    {
      const arrMybutton = props.toolbar.find((p) => p[0] === 'mybutton')
      if(arrMybutton && arrMybutton.length)
      {
        const array = arrMybutton[1] as Array<string>
        if(array.find((p) => p === 'htmlMode'))
        {
          return true
        }
      }
    }
    return false
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [])
  return (
    <>
      <ImportHead isUseCodeMirror={isUseCodeMirror}/>
      <NoSsr>
        <EditorMemo
          id={id}
          value={props.value}
          onChange={props.onChange}
          maxSize={props.maxSize}
          maxFiles={props.maxFiles}
          maxLength={props.maxLength}
          toolbar={props.toolbar}
        />
      </NoSsr>
    </>
  )
})

export default GgjEditor
