import React, { CSSProperties } from 'react'

type IGlobalIframeProps = {
    pageUrl: string
    hidden?: boolean
    onLoad?: () => void
}

const IFRAME_STYLES: CSSProperties = { width: '100%' }

const GlobalIframeForwardRef = React.forwardRef<HTMLIFrameElement, IGlobalIframeProps>((props, ref) => {
    const { pageUrl, hidden, onLoad } = props
    const shouldHideIframe = hidden === undefined ? true : hidden

    return (
        <iframe
            style={IFRAME_STYLES}
            ref={ref}
            src={pageUrl}
            hidden={shouldHideIframe}
            frameBorder={0}
            scrolling={'no'}
            onLoad={onLoad}
        />
    )
})

GlobalIframeForwardRef.displayName = 'GlobalIframe'
const GlobalIframe = React.memo(GlobalIframeForwardRef)

export default GlobalIframe
