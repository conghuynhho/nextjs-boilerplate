# Default Header for desktop 
- Behavior: Position fixed
- Include: Skijan logo, except children
- Devices: Desktop and Mobile
- Usage:
```
import {GgjDesktopHeader} from '../../commons/GgjHeader'

<GgjDesktopHeader>
  {item}
</GgjDesktopHeader>
```
![img.png](img.png)

# Default Header for mobile (mostly in detail page)
- Behavior: Position fixed, Auto hide on scroll
- Include: Back button (default: ```() => router.back()```), title (optional), no children
- Devices: Mobile (Mostly)
- Usage:
```
import {GgjMobileHeader} from '../../commons/GgjHeader'

<GgjMobileHeader/>
```
![img_2.png](img_2.png)

# Skijan logo
- Usage:
```
import {SkijanLogo} from '../../commons/GgjHeader'

<SkijanLogo/>
```
![img_3.png](img_3.png)
