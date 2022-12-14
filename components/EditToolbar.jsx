import { Toolbar, SaveButton, DeleteButton } from 'react-admin'
import BackButton from './BackButton'

const EditToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton />
    <BackButton
      variant='outlined'
      color='secondary'
      style={{ marginLeft: '1rem' }}
    >
      Cancel
    </BackButton>
    <DeleteButton />
  </Toolbar>
)

export default EditToolbar;