import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { SpaceEntry } from '../model/model';
import { DataService } from '../../services/DataService';
import SingleSpace from './SingleSpace';

interface SpacesProps {
  dataService: DataService;
}

export default function Spaces(props: SpacesProps) {
  const [spaces, setSpaces] = useState<SpaceEntry[]>();
  const [reserveText, setReserveText] = useState<string>();

  // fetch all spaces from database
  useEffect(() => {
    const getSpaces = async () => {
      console.log('Loading spaces ...');
      const spaces = await props.dataService.getSpaces();
      setSpaces(spaces);
    };
    getSpaces();
  }, []);

  function reserveSpace(spaceId: string, spaceName: string) {
    const reserveResult = props.dataService.reserveSpace(spaceId);
    setReserveText(`You reserved ${spaceName}, reservation id: ${reserveResult}`);
  }

  function renderSpaces() {
    if (!props.dataService.isLogin()) {
      return <NavLink to={'/login'}>Please login</NavLink>;
    }
    const rows: any[] = [];
    if (spaces) {
      for (const spaceEntry of spaces) {
        rows.push(
          <SingleSpace
            key={spaceEntry.spaceId}
            spaceId={spaceEntry.spaceId}
            name={spaceEntry.name}
            location={spaceEntry.location}
            photoUrl={spaceEntry.photoUrl}
            reserveSpace={reserveSpace}
          />
        );
      }
    }

    return rows;
  }

  return (
    <div>
      <h2>Welcome to the Spaces page!</h2>
      {reserveText ? <h3>{reserveText}</h3> : undefined}
      {renderSpaces()}
    </div>
  );
}
