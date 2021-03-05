import { VRApp, VRObject } from '../../sdk/VRCore/frameworks/VRApp';
import { JsonUtils } from '../../sdk/VRUtils/JsonUtils';
import { ZipUtils } from '../../sdk/VRUtils/ZipUtils';
import { ClipperUtils } from '../../sdk/VRCore/math/ClipperUtils';
import { PolygonUtils } from '../../sdk/VRCore/math/PolygonUtils';
import { MathHelper } from '../../sdk/VRCore/math/MathHelper';
import { EventListener } from '../../sdk/VRCore/frameworks/EventListener';
import { ResourcesLoader } from '../../sdk/VRCore/frameworks/ResourcesLoader';
import { KFUtils } from '../../sdk/VRUtils/KFUtils';
import { MeshData, MeshSection, MeshFace } from '../../sdk/VRCore/geometries/MeshData';
import { Signal } from '../../sdk/VRUtils/Signals';
import { PanoramaControls } from '../../sdk/VRCore/controls/PanoramaControls';
import { Segment } from '../../sdk/VRCore/math/Segment';

// eslint-disable-next-line import/prefer-default-export
export const VRCore = {
  VRApp,
  VRObject,
  EventListener,
  ResourcesLoader,
  Util: KFUtils,
  JsonUtils,
  MathHelper,
  MeshData,
  MeshSection,
  MeshFace,
  Signal,
  PanoramaControls,
  ClipperUtils,
  PolygonUtils,
  ZipUtils,
  Segment,
};
