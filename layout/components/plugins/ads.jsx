const AdsContainer = props => {
    const {theme, markdown, __} = props
    const parse = require('html-react-parser').default
    return (
        <div className="ads-container ad-banner banner-ad-section AdBar"> 
            { theme.ads.title && <div className="ads-title cap theme">{__('meta.ads_title')}</div>}
            <div 
                className="ad-content"
                dangerouslySetInnerHTML={{ __html: theme.ads.html || '' }}
            />
                <div 
                    className="ad-loading-message"
                >
                    {theme.ads.description && parse(markdown(theme.ads.description))}
                </div>
        </div>
    ); // AdBar 故意命中了一个 Easylist 规则，使得广告屏蔽器启用时这段能被整个屏蔽
};

module.exports = AdsContainer