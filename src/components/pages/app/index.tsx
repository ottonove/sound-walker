import * as React from 'react';
import { Route, Switch } from 'react-router';
import * as styles from './style.css';
import { TitleView } from '../title/title-container';
import { PlayerView } from '../player/player-container';
import { State } from '../../../constant/initial-state';
import { LoadingCircle } from '../../commons/loading-circle';
import { VerticalAnnounce } from '../../commons/vertical-announce/index';
import {
  MusicSelectView,
  MUSIC_SELECT_DJ_MODE,
  MUSIC_SELECT_PLAY,
} from '../music-select/music-select-container';
import { LogoTransition } from '../../commons/logo-transition';
import { AppProps } from './app-container';

export class App extends React.Component<State & AppProps, {}> {
  render() {
    const { system, setLogoTransition } = this.props;
    const { isSystemReady, display } = system;
    return (
      <div className={styles.container}>
        <Switch>
          <Route
            path="/player/:musicId"
            render={(props) => (
              <PlayerView
                mode={MUSIC_SELECT_PLAY}
                isSystemReady={isSystemReady}
                {...props}
              />
            )}
          />
          <Route
            path="/dj-player/:musicId"
            render={(props) => (
              <PlayerView
                mode={MUSIC_SELECT_DJ_MODE}
                isSystemReady={isSystemReady}
                {...props}
              />
            )}
          />
          <Route
            path="/music-select"
            render={() => (
              <MusicSelectView
                mode={MUSIC_SELECT_PLAY}
                isSystemReady={isSystemReady}
              />
            )}
          />
          <Route
            path="/dj-mode"
            render={() => (
              <MusicSelectView
                mode={MUSIC_SELECT_DJ_MODE}
                isSystemReady={isSystemReady}
              />
            )}
          />
          <Route path="/" component={TitleView} />
        </Switch>
        {display.logoTransition.isVisible ? (
          <LogoTransition
            duration={display.logoTransition.duration}
            setLogoTransition={setLogoTransition}
          />
        ) : null}
        <LoadingCircle isVisible={display.isLoadingCircleVisible} />
        <VerticalAnnounce isVisible={!display.isPortrait} />
      </div>
    );
  }
}
