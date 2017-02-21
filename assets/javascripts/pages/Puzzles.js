//react
import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'

//material-ui
import {Dropdown, MenuItem, Glyphicon} from 'react-bootstrap'
import {Card, CardMedia} from 'material-ui/Card'
import Snackbar from 'material-ui/Snackbar'

//internal component
import FilterPanel from '../presentations/FilterPanel'
import { fetchPuzzles, fetchTags } from '../actions/FetchActions'
import { setPuzzleFilter, setRangeFilter } from '../actions/Actions'

//external component
import { StyleSheet, css } from 'aphrodite'

class Puzzles extends Component {

  static propTypes = {
    expanded: T.bool.isRequired,
    tags: T.object.isRequired,
    puzzles: T.object.isRequired,
  }

  static defaultProps = {
    expanded: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      tipsOpen: false,
      isLoading: false,
    }
    this.handleSeeMore = this.handleSeeMore.bind(this)
  }

  handleSeeMore(rank) {
    let range = []
    if (rank === 'all' || rank === null) {
      range = ['18k', '9d']
    } else {
      range = rank.split('-')
    }
    this.props.dispatch(setPuzzleFilter({start: range[0], end: range[1] }))
    this.props.dispatch(setRangeFilter({start: range[0], end: range[1] }))
    this.props.dispatch(fetchPuzzles({
      rank: rank || this.props.puzzleFilter,
    }))
  }

  handleTips() {
    this.setState({
      tipsOpen: true
    })
  }

  componentDidMount() {
    let { query } = this.props.location
    this.props.dispatch(fetchTags({}))
    this.props.dispatch(fetchPuzzles({
      page: query.page,
      rank: query.rank
    }))
  }

  render() {
    const { puzzles, tags } = this.props
    if (_.isNil(puzzles) || _.isNil(tags) || _.isNil(tags.data)) return null

    let range = this.props.puzzleFilter['start'] + '-' + this.props.puzzleFilter['end']
    let puzzlesCards = []
    let filter
    if (!puzzles.isFetching && puzzles.data != null && puzzles.data.puzzles.length > 0) {
      filter =
        <FilterPanel
          handleSeeMore={this.handleSeeMore}
          tags={tags.data}
          range={range}
          rank_18k_10k_count={puzzles.data.rank_18k_10k_count}
          rank_9k_5k_count={puzzles.data.rank_9k_5k_count}
          rank_4k_1k_count={puzzles.data.rank_4k_1k_count}
          rank_1d_3d_count={puzzles.data.rank_1d_3d_count}
          rank_4d_6d_count={puzzles.data.rank_4d_6d_count}
        />
        puzzles.data.puzzles.forEach((i) => {
          puzzlesCards.push(
            <Card  className={css(styles.card)}>
              <CardMedia
                className={css(styles.puzzleImg)}
              >
                <Link to={`/puzzles/${i.id}`}>
                  <img className={css(styles.previewImg)} src={i.preview_img_r1.x300.url} />
                </Link>
              </CardMedia>
            </Card>
          )
        })
    }
    else {
      puzzlesCards =
        <div className={css(styles.loading)}>
          <i className="fa fa-spinner fa-pulse fa-fw"></i>
        </div>
        filter =
        <FilterPanel
          handleSeeMore={this.handleSeeMore}
          tags={tags.data}
          range={range}
          rank_18k_10k_count={0}
          rank_9k_5k_count={0}
          rank_4k_1k_count={0}
          rank_1d_3d_count={0}
          rank_4d_6d_count={0}
        />
    }
    return (
      <div style={{marginLeft: this.props.expanded === true ? '235px' : '50px'}} className="page-container">
        <div className="page-nav">
          <Dropdown className="filter">
            <Dropdown.Toggle>
              <Glyphicon className="filter-icon" glyph="filter" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="super-colors">
              <div className="popover-title">Level</div>
              <div className="popover-content">
                <ul className="tags">
                  <li className="tag">18K-10K</li>
                  <li className="tag">9K-5K</li>
                  <li className="tag">4K-1K</li>
                  <li className="tag">1D-3D</li>
                  <li className="tag">4D-6D</li>
                </ul>
              </div>
              <div className="popover-title">Tags</div>
              <div className="popover-content">
                <ul className="tags">
                  { tags.data.map((tag) => <li className="tag">{`${tag.name}(${tag.taggings_count})`}</li>)}
                </ul>
              </div>
            </Dropdown.Menu>
          </Dropdown>
          <ul className="page-subnav">
            <li><a title="Rank: xxx"><span>Rank: 18k - 10k</span></a></li>
            <li><a title="Tag: xxx"><span>Tags: xxx</span></a></li>
          </ul>
        </div>
        <div className={css(styles.puzzlesLeft)}>
          { puzzlesCards }
        </div>
        <div className={css(styles.puzzlesRight)}>
          <span className={css(styles.title)}>Tags</span>
          <div className={css(styles.buttonGroup)}>
            {
              //<RaisedButton className={css(styles.button)} secondary={true} label="Tsumego Test" /> 
              //<RaisedButton onClick={this.handleSeeMore.bind(this, null)} className={css(styles.button)} primary={true} label="See More" />
            }
          </div>
          { filter }
        </div>
        <Snackbar
          open={this.state.tipsOpen}
          message={'This function is not OPEN'}
          autoHideDuration={5000}
          bodyStyle={{
            backgroundColor: 'black',
            fontSize: '20px'
          }}
        />
      </div>
    )
  }
}

const styles = StyleSheet.create({

  puzzlesContainer: {
    display: 'flex',
    marginTop: '20px',
    backgroundColor: '#fff',
    padding: '20px',
  },

  puzzlesLeft: {
  },

  puzzlesRight: {
    display: 'flex',
    flexFlow: 'column nowrap',
    flex: '0 0 230px'
  },

  title: {
    fontSize: '20px',
  },

  chooseLevel: {
    fontSize: '22px',
    lineHeight: '22px',
    fontWeight: '300',
    marginTop: '10px',
  },

  buttonGroup: {
    marginBottom: '30px'
  },

  button: {
    width: '100%',
    marginBottom: '15px',
  },

  card: {
    width: '120px',
    height: '150px',
    margin: '5px',
    float: 'left',
  },

  puzzleImg: {
    flex: '1 1 auto',
    justifyContent: 'space-between',
  },

  puzzleTitle: {
    flex: '1 1 auto',
    justifyContent: 'space-between',
  },

  previewImg: {
    width: '100%',
  },

  puzzleActions: {
    height: '50px',
    flex: '1 1 auto',
    justifyContent: 'space-between',
  },

  loading: {
    fontSize: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    margin: '0 auto',
  },

  ratingIcon: {
    width: 28,
    height: 28
  }

})

function select(state) {
  return {
    puzzles: state.puzzles,
    puzzleFilter: state.puzzleFilter,
    rangeFilter: state.rangeFilter,
    tags: state.tags,
  }
}

export default connect(select)(Puzzles)
