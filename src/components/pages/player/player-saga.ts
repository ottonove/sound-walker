import { put, takeEvery, select, call } from 'redux-saga/effects';
import * as PlayerAction from './player-actions';
import * as SystemAction from '../../../systems/system-actions';
import { Sound, SystemState } from '../../../systems/system-interfaces';
import { AudioUtils } from '../../../utilities/audio-utils';
import { request } from '../../../utilities/request';
import { delay } from '../../../utilities/delay';
import { PlayerState } from './player-interfaces';
import { push } from 'react-router-redux';

const playerSaga = [
  takeEvery(PlayerAction.LOAD_MUSIC, function*(action: PlayerAction.LoadMusic) {
    yield put(SystemAction.setLoadingCircleVisible(true));

    const { url } = action.payload;
    const musicSource = yield call(async () => {
      const audioUtils = AudioUtils.instance;
      const audioBuffer = await audioUtils.loadAudioBufferFromUrl({
        url,
        onProgress: (loaded: number) => {
          const playerMusicProgress = document.getElementById(
            'player-music-progress'
          );
          if (playerMusicProgress) {
            const progress = loaded < 1.0 ? Math.floor(loaded * 100.0) : 100;
            playerMusicProgress.innerText = `${progress}%`;
          }
        },
      });
      const source = audioUtils.context.createBufferSource();

      source.buffer = audioBuffer;
      source.loop = false;

      return source;
    });

    const { system } = yield select();
    const { systemGainNode } = system.sound as Sound;
    musicSource.connect(systemGainNode);

    yield put(PlayerAction.setMusicSource(musicSource));
    yield put(SystemAction.setLoadingCircleVisible(false));
  }),

  takeEvery(PlayerAction.START_MUSIC, function*(
    _action: PlayerAction.StartMusic
  ) {
    const { player, system } = yield select();
    const { source } = player as PlayerState;
    const { sound } = system as SystemState;

    if (sound.context.state === 'suspended') {
      sound.context.resume();
      yield delay(250);
    }

    source.start(0, 0);
    yield put(PlayerAction.setOffsetCurrentTime(source.context.currentTime));

    source.onended = (e) => {
      console.log('onended', e);
      source.stop();
    };
  }),

  takeEvery(PlayerAction.LOAD_MUSIC_INFO, function*(
    action: PlayerAction.LoadMusicInfo
  ) {
    const { musicId } = action.payload;

    const scoreJson = yield call(async () => {
      const response = await request(`/scores/${musicId}.json`);
      const scoreJson = await response.json();

      return scoreJson;
    });

    yield put(PlayerAction.setMusicInfo(scoreJson));
  }),

  takeEvery(PlayerAction.LOAD_SOUND_NODES, function*(
    _action: PlayerAction.LoadSoundNodes
  ) {
    const { system } = yield select();
    const {
      filterNode,
      systemGainNode,
      analyzerNode,
      analyzerParams,
    } = system.sound as Sound;

    yield put(
      PlayerAction.setSoundNodes({
        filterNode,
        systemGainNode,
        analyzerNode,
        analyzerParams,
      })
    );
  }),

  takeEvery(PlayerAction.BACK_TO_DJ_MODE, function*(
    _action: PlayerAction.BackToDJMode
  ) {
    const { player } = yield select();
    const { source } = player as PlayerState;

    source.stop();
    yield put(push(`/dj-mode`));
  }),
];

export default playerSaga;
