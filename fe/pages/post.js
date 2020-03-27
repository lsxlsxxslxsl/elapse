import { Component } from 'react'
import { initStore } from '../redux/store'
import { bindActionCreators } from 'redux'
import withRedux from 'next-redux-wrapper'

import ArticleService from '../service/article'
import ClassifyService from '../service/classify'
import TagService from '../service/tag'

import LinePanel from '../components/common/line-panel'
import Layout from '../components/common/layout'
import Footer from '../components/common/footer'
import ArticleTags from '../components/post/article-tags'
import RecentArricles from '../components/post/recent-articles'
import ArticleClassify from '../components/post/article-classify'
import ArticleList from '../components/post/article-list'
import Backtop from '../components/common/backtop'

import '../theme/pages/post.scss'

class Post extends Component {
  constructor() {
    super()
    this.state = {
      showAside: false
    }
  }

  static async getInitialProps({ query }) {
    let tag = query.tag
    let classify = query.classify
    let keyword = query.keyword
    let conditions = {}
    let articles = []

    if (!!tag) {
      tag = await TagService.fetchTagByValue(tag)
      conditions.tag = (tag && tag._id) || ''
    }

    if (!!classify) {
      classify = await ClassifyService.fetchClassifyByValue(classify)
      conditions.classify = (classify && classify._id) || ''
    }

    if (!!keyword) {
      conditions.keyword = keyword
    }

    articles = await ArticleService.fetchArticles(conditions)

    const recentArticles = await ArticleService.fetchRecentArticles()
    const classifies = await ArticleService.fetchArticleClassifies()

    return { articles, tag, classify, recentArticles, classifies }
  }

  componentDidMount() {
    document.title = `${
      this.props.tag ? this.props.tag.title : '首页'
    } | Justemit`
    const isMobile = /mobile/gi.test(window.navigator.userAgent)

    if (isMobile) {
      return
    }

    // Todo：固定侧边栏，效果没做好，先注释掉
    // const oAside = this.refs.aside;

    // window.addEventListener('scroll', function () {
    //   const scrollTop = this.scrollY;

    //   if (scrollTop > 200) {
    //     oAside.classList.add('is-fix');
    //   } else {
    //     oAside.classList.remove('is-fix');
    //   }
    // }, false)
  }

  componentDidUpdate() {
    document.title = `${
      this.props.tag ? this.props.tag.title : '首页'
    } | Hyiron`
  }

  toggleAside = () => {
    const isMobile = /mobile/gi.test(window.navigator.userAgent)

    if (!isMobile) {
      return
    }

    this.setState({
      showAside: !this.state.showAside
    })
  }

  render() {
    const { showAside } = this.state
    const {
      articles = [],
      tag,
      classify,
      recentArticles,
      classifies
    } = this.props

    return (
      <div>
        <Layout
          noFooter={true}
          activeRoute={'/post'}
          wrapper={`
        <a href="/"><h2>Explore in every moment of the cudgel thinking</h2></a>
        <h4>在每一个苦思冥想的瞬间求知</h4>
        `}
        >
          <div className="container page">
            <div className="articles">
              {tag && tag.title ? (
                <div className="search-key">{tag.title} 标签相关的文章</div>
              ) : classify && classify.title ? (
                <div className="search-key">
                  {classify.title} 分类相关的文章
                </div>
              ) : (
                ''
              )}
              {articles && articles.length > 0 ? (
                <ul>
                  {articles.map((article, i) => (
                    <ArticleList article={article} key={i} />
                  ))}
                </ul>
              ) : (
                <p className="tip">暂无文章</p>
              )}
            </div>

            <aside className={showAside ? 'is-active' : ''}>
              <div ref="aside">
                <RecentArricles articles={recentArticles} />
                <ArticleClassify classifies={classifies} />
                <ArticleTags />
              </div>
            </aside>
            {/* <div className={showAside ? 'm-fbtn is-close' : 'm-fbtn'} onClick={() => this.toggleAside()}>
            <i className="ion-plus-round" /> onClick={() => this.toggleAside()}
          </div> */}
          </div>
          <Backtop />
        </Layout>
        {/* <div className="articles-meta">
          <div className="container">
            <RecentArricles articles={recentArticles} />
            <ArticleClassify classifies={classifies} />
            <ArticleTags />
          </div>
          <div className="cover" />
        </div> */}
        <Footer />
      </div>
    )
  }
}

export default withRedux(initStore)(Post)
