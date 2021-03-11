import dynamic from 'next/dynamic';
import { isMobile } from '../../../../../../tools/common';

const SceneChange = dynamic(() => {
  if (isMobile) return import('../mobile/1.0');
  return import('../pc/1.0');
});

export default SceneChange;
