const { Fragment } = require('react')
const ReadNext = (props) => {
  const { page, config, theme, url_for, date, __ } = props
  let prev, next
  let title_prev = __('meta.prev')
  let title_next = __('meta.next')
  if (page.layout === 'post') {
    prev = page.prev
    next = page.next
    title_prev = __('meta.newer')
    title_next = __('meta.older')
  } else if (page.layout === 'wiki' && page.wiki && page.wiki.length > 0) {
    let proj = theme.wiki.tree[page.wiki]
    if (proj) {
      let ps = proj.pages?.filter((p) => p.path == page.path)
      if (ps?.length > 0) {
        const current_page_number = ps[0].page_number || 0
        proj.pages.forEach((p, i) => {
          if (p.page_number < current_page_number) {
            if (prev == undefined || p.page_number > prev.page_number) {
              prev = p
            }
          } else if (p.page_number > current_page_number) {
            if (next == undefined || p.page_number < next.page_number) {
              next = p
            }
          }
        })
      } else {
        console.error('未找到当前页')
      }
    }
  }

  if (prev || next) {
    return (
      <div className='related-wrap reveal' id='read-next'>
        <section className='body'>
          <div className='item' id='prev'>
            {prev && (
              <Fragment>
                <div className='note'>{title_prev}</div>
                <a href={url_for(prev.path)}>
                  {prev.title ||
                    prev.seo_title ||
                    prev.wiki ||
                    date(prev.date, config.date_format)}
                </a>
              </Fragment>
            )}
          </div>
          <div className='item' id='next'>
            {next && (
              <Fragment>
                <div className='note'>{title_next}</div>
                <a href={url_for(next.path)}>
                  {next.title ||
                    next.seo_title ||
                    next.wiki ||
                    date(next.date, config.date_format)}
                </a>
              </Fragment>
            )}
          </div>
        </section>
      </div>
    )
  } else return <></>
}

module.exports = ReadNext
