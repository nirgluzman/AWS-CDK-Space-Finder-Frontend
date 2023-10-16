import { SyntheticEvent, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { DataService } from '../../services/DataService';

type CreateSpaceProps = {
  dataService: DataService;
};

type CustomEvent = {
  target: HTMLInputElement;
};

export default function CreateSpace({ dataService }: CreateSpaceProps) {
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [photo, setPhoto] = useState<File | undefined>();
  const [actionResult, setActionResult] = useState<string>('');

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (name && location) {
      const id = await dataService.createSpace(name, location, photo);
      setActionResult(`Space ${name} created with id ${id}`);
      setName('');
      setLocation('');
    } else {
      setActionResult('Please fill all fields!');
    }
  };

  function setPhotoUrl(event: CustomEvent) {
    // if event.target has 'files' property and the first element in the 'files' array is not null,
    // then it contains the file that the user has selected.
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
    }
  }

  // function to render an image from the photo state.
  function renderPhoto() {
    if (photo) {
      const localPhotoURL = URL.createObjectURL(photo); // method to create a DOMString containing a URL representing the object given in the parameter.
      return (
        <img
          alt=''
          src={localPhotoURL}
          style={{ maxWidth: '200px' }}
        />
      );
    }
  }

  function renderForm() {
    if (!dataService.isAuthorized()) {
      return <NavLink to='/login'>Please login first!</NavLink>;
    }
    return (
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Name:</label>
        <br />
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />

        <label>Location:</label>
        <br />
        <input
          type='text'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <br />

        <label>Photo:</label>
        <br />
        <input
          type='file'
          onChange={(e) => setPhotoUrl(e)}
        />
        <br />
        {renderPhoto()}
        <br />

        <input
          type='submit'
          value='Create space'
        />
      </form>
    );
  }

  return (
    <>
      {renderForm()}
      {actionResult ? <label className='message'>{actionResult}</label> : undefined}
    </>
  );
}
