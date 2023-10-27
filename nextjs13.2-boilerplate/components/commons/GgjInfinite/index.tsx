import InfiniteScroll, {Props} from 'react-infinite-scroll-component'

/* eslint-disable  @typescript-eslint/no-explicit-any */
export class GGjInfiniteScroll extends InfiniteScroll {
  removeEvent = () => {
    if (!this || !(this as any).el) return

    if (this.props.pullDownToRefresh) {
      (this as any).el.removeEventListener('touchstart', this.onStart);
      (this as any).el.removeEventListener('touchmove', this.onMove);
      (this as any).el.removeEventListener('touchend', this.onEnd);

      (this as any).el.removeEventListener('mousedown', this.onStart);
      (this as any).el.removeEventListener('mousemove', this.onMove);
      (this as any).el.removeEventListener('mouseup', this.onEnd)
    }

    (this as any).el.removeEventListener('scroll', (this as any).throttledOnScrollListener as EventListenerOrEventListenerObject)
  }

  addEvent = () => {
    if (!this || !(this as any).el) return

    if (this.props.pullDownToRefresh) {
      (this as any).el.addEventListener('touchstart', this.onStart);
      (this as any).el.addEventListener('touchmove', this.onMove);
      (this as any).el.addEventListener('touchend', this.onEnd);

      (this as any).el.addEventListener('mousedown', this.onStart);
      (this as any).el.addEventListener('mousemove', this.onMove);
      (this as any).el.addEventListener('mouseup', this.onEnd)
    }

    (this as any).el.addEventListener('scroll', (this as any).throttledOnScrollListener as EventListenerOrEventListenerObject)
  }

  componentDidUpdate = (prevProps: Props) => {
    // if props.height have exists, component no need to update scrollableTarget
    if (this.props.height) return

    if (prevProps.scrollableTarget !== this.props.scrollableTarget) {
      // update _scrollableNode
      (this as any)._scrollableNode = this.getScrollableTarget()

      // clean old event
      this.removeEvent && this.removeEvent();

      // and update this.el
      (this as any).el = ((this as any)._scrollableNode || window)

      // add event
      this.addEvent && this.addEvent()
    }
    super.componentDidUpdate(prevProps)
  }
}
/* eslint-enable  @typescript-eslint/no-explicit-any */

const GgjInfinite = (props: Props) => {
  return (
    <GGjInfiniteScroll
      scrollThreshold={0.8}
      {...props}
      endMessage=""
    />
  )
}
export default GgjInfinite
