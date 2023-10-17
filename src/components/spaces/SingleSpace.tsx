import genericImage from '../../assets/generic-photo.png';
import { SpaceEntry } from '../model/model';
import './SingleSpace.css';

interface SingleSpaceProps extends SpaceEntry {
  reserveSpace: (spaceId: string, spaceName: string) => void;
}

export default function SingleSpace(props: SingleSpaceProps) {
  function renderImage() {
    if (props.photoUrl) {
      return <img src={props.photoUrl} />;
    } else {
      return <img src={genericImage} />;
    }
  }

  return (
    <div className='space'>
      {renderImage()}
      <label className='name'>{props.name}</label>
      <br />
      <label className='location'>{props.location}</label>
      <br />
      <button onClick={() => props.reserveSpace(props.spaceId, props.name)}>Reserve</button>
    </div>
  );
}
