// @flow
import React, { Component } from 'react';
import { IpcRenderer, ipcRenderer } from 'electron';
import { Icon, Button, Popover } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CIcon from '../Icon/Icon';

import styles from './SideBar.scss';

import * as AuthActions from '../../../actions/auth';
import * as ProfileActions from '../../../actions/profile';

type Props = {};

class SideBar extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      updateAvailable: false,
      isUpdating: false,
      updateCompleted: false,
      textUpdate: "Update Available"
    };
  }

  componentDidMount = () => {
    if (process.env.NODE_ENV !== 'development') {
      ipcRenderer.send('check-for-updates');
      ipcRenderer.on('update-available', () => {
        this.setState({ updateAvailable: true });
      });
      ipcRenderer.on('update-downloaded', () => {
        this.setState({
          updateAvailable: true,
          isUpdating: false,
          updateCompleted: true,
          textUpdate: "Restart App"
        });
      });
    }
  };

  handleUpdateClick = () => {
    this.setState({ isUpdating: true, textUpdate: "Updating..." });
    ipcRenderer.send('download-updates');
  };

  handleUpdateCompletedClick = () => {
    ipcRenderer.send('apply-updates');
  };

  render() {
    return (
      <aside className={styles.sidenav}>
        {this.state.updateAvailable && (
          <div className={styles.updateAvailable}>
            <Button
              loading={this.state.isUpdating}
              onClick={
                this.state.updateCompleted
                  ? this.handleUpdateCompletedClick
                  : this.handleUpdateClick
              }
              type="primary"
              size="small"
              style={{ marginLeft: 5 }}
            >
              {this.state.textUpdate}
            </Button>
          </div>
        )}
        <div className={styles.header}>
          <span>
            <CIcon size={32}>
              {this.props.username &&
                this.props.username.charAt(0).toUpperCase()}
            </CIcon>
          </span>
          <span>{this.props.username}</span>
          <div onClick={() => this.props.logout()}>
            <i className={`fas fa-sign-out-alt ${styles.logout}`} />
          </div>
        </div>
        <div
          style={{ textAlign: 'center', fontWeight: 'italic', fontSize: 12 }}
        >
          <span>Playing on</span>{' '}
          <Popover placement="left" title="Coming Soon">
            <b
              className={styles.playingServer}
              style={{
                fontStyle: 'italic',
                fontWeight: '900',
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              AnonymousCraft
            </b>
          </Popover>
        </div>
        <hr />
        <div className={styles.socialActions}>
          Favourites
          <div>
            <Icon type="plus-circle" theme="outlined" />
            <Icon type="sort-ascending" theme="outlined" />
            <Icon type="search" theme="outlined" />
          </div>
        </div>
        <div className={styles.scroller}>
          <h1>Coming Soon</h1>
          {/* <div style={{ height: 1000 }}>
            <div className={styles.serv}>
              AnonymousCraft
              <i className="fas fa-play" style={{ marginTop: 3 }} />
            </div>
            <div className={styles.serv}>HyPixel</div>
            <div className={styles.serv}>PvPWars</div>
            <div className={styles.serv}>Mineplex</div>
          </div> */}
        </div>
        <hr />
        <div className={styles.socialsContainer}>
          {/* eslint-disable */}
          <a
            href="https://twitter.com/gorilladevs"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialBtn}
          >
            <i className="fab fa-twitter" />
          </a>
          <a
            href="https://facebook.com/gorilladevs"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialBtn}
          >
            <i className="fab fa-facebook" />
          </a>
          <a
            href="https://discordapp.com/invite/4cGYzen"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialBtn}
          >
            <i className="fab fa-discord" />
          </a>
          <span className={styles.version}>
            v{require('../../../../package.json').version}
          </span>
          {/* eslint-enable */}
        </div>
      </aside>
    );
  }
}

function mapStateToProps(state) {
  return {
    username: state.auth.displayName,
    profileState: state.profile.profileState,
    stateColor: state.profile.stateColor,
    downloadQueue: state.downloadManager.downloadQueue,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { ...AuthActions, ...ProfileActions },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);
