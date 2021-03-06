import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import ObservedImage from '../../components/ObservedImage';
import Button from '../../components/UI/Button';
import Checklist from '../../components/Checklist';

import checklists from '../../utils/checklists';

import './styles.css';

function getItemsPerPage(width) {
  if (width >= 1600) return 5;
  if (width >= 1200) return 4;
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  if (width < 768) return 1;
  return 1;
}

const ListButton = p => (
  <li key={p.checklistId} className={cx('linked', { active: p.visible })} onClick={p.onClick}>
    {p.checklistImage ? <ObservedImage className='image icon' src={p.checklistImage} /> : <div className='icon'>{p.checklistIcon}</div>}
  </li>
);

export class Checklists extends React.Component {
  state = {
    page: 0,
    itemsPerPage: null
  };

  static getDerivedStateFromProps(p, s) {
    if (s.itemsPerPage) {
      return null;
    }

    return {
      page: 0,
      itemsPerPage: getItemsPerPage(p.viewport.width)
    };
  }

  handler_toggleCompleted = e => {
    const currentState = this.props.collectibles;
    const newState = {
      hideCompletedChecklistItems: !currentState.hideCompletedChecklistItems
    };

    this.props.setCollectibleDisplayState(newState);
  };

  componentDidUpdate(prevProps, prevState) {
    const newWidth = this.props.viewport.width;
    if (prevProps.viewport.width !== newWidth) {
      this.setState({ itemsPerPage: getItemsPerPage(newWidth) });
    }
    if (prevState.itemsPerPage !== this.state.itemsPerPage || prevState.page !== this.state.page) {
      this.props.rebindTooltips();
    }
  }

  handler_changeSkip = index => e => {
    this.setState({
      page: Math.floor(index / this.state.itemsPerPage)
    });
  };

  render() {
    const { t } = this.props;
    const { page, itemsPerPage } = this.state;

    const lists = [checklists[1697465175](), checklists[3142056444](), checklists[4178338182](), checklists[2360931290](), checklists[365218222](), checklists[2955980198](), checklists[2609997025](), checklists[1297424116](), checklists[2726513366](), checklists[1912364094](), checklists[1420597821](), checklists[3305936921](), checklists[655926402](), checklists[4285512244](), checklists[2474271317]()];

    // console.log(lists)

    const sliceStart = parseInt(page, 10) * itemsPerPage;
    const sliceEnd = sliceStart + itemsPerPage;

    const visible = lists.slice(sliceStart, sliceEnd);

    const toggleCompletedLink = (
      <Button action={this.handler_toggleCompleted}>
        {this.props.collectibles.hideCompletedChecklistItems ? (
          <>
            <i className='segoe-uniF16E' />
            {t('Show all')}
          </>
        ) : (
          <>
            <i className='segoe-uniF16B' />
            {t('Hide completed')}
          </>
        )}
      </Button>
    );

    return (
      <>
        <div className='view' id='checklists'>
          <div className={cx('padder', 'cols-' + this.state.itemsPerPage)}>
            <div className='module views'>
              <ul className='list'>
                {lists.map((list, l) => (
                  <ListButton key={list.checklistId} checklistItemName_plural={list.checklistName} checklistIcon={list.checklistIcon} checklistImage={list.checklistImage} visible={visible.includes(list)} onClick={this.handler_changeSkip(l)} />
                ))}
              </ul>
            </div>
            {visible.map(list => (
              <div key={list.checklistId} className='module list'>
                <Checklist {...list} />
              </div>
            ))}
          </div>
        </div>
        <div className='sticky-nav'>
          <div className='wrapper'>
            <div />
            <ul>
              <li>{toggleCompletedLink}</li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    collectibles: state.collectibles,
    viewport: state.viewport
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    },
    setCollectibleDisplayState: value => {
      dispatch({ type: 'SET_COLLECTIBLES', payload: value });
    }
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(Checklists);
