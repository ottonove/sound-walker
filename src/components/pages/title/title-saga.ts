import { put, takeEvery, select } from 'redux-saga/effects';
import * as TitleAction from './title-actions';
import * as SystemAction from '../../../systems/system-actions';
import { Sound } from '../../../systems/system-interfaces';
import { push } from 'react-router-redux';

const titleSaga = [
  takeEvery(TitleAction.START_GAME_TITLE, function*(
    _action: TitleAction.StartGameTitle
  ) {
    const { system } = yield select();
    const { sources } = system.sound as Sound;
    sources.title.start(0, 0);

    yield put(push('/title/intro'));
  }),

  takeEvery(TitleAction.GO_TO_MAIN_MENU, function*(
    _action: TitleAction.GoToMainMenu
  ) {
    yield put(push('/title/menu'));
  }),

  takeEvery(TitleAction.JUMP_TITLE_SOUND, function*(
    _action: TitleAction.JumpTitleSound
  ) {
    const { system } = yield select();
    const { sources } = system.sound as Sound;

    yield put(
      SystemAction.remakeSystemSounds({
        key: 'title',
        bufferNode: sources.title,
        startTime: 11.65,
        soonToPlay: true,
      })
    );
  }),
];

export default titleSaga;