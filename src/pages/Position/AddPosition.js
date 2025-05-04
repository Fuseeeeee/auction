import React, { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Stack, Container, Typography, TextField} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';



export default function AddPosition({ open, onClose, submit, updated, button, data, matchId }) {

  const [update, setUpdate] = useState(updated);

  
  
  const validSchema = Yup.object().shape({
    pos_name: Yup.string().matches(/^\S/, 'Whitespace is not allowed').required('position Name is required'),
  });

  const [alertMsg, setAlert] = useState();

  const formik = useFormik({
    initialValues: {
      pos_name: update ? data.pos_name : '',
    },
    validationSchema: validSchema,
    onSubmit: (values, actions) => {
      onAdd();
    }
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const alertTimeOut = () => {
    setTimeout(() => {
      setAlert();
    }, 2000);
  };

  const onAdd = () => {
    if (!values.pos_name.trim()) {
      alert('Position name is required');
      return;
    }

    const updateCall = () => {
      console.log(values.pos_name);
      axios.post("http://localhost:3001/updatePos", {
        pos_value: values.pos_name,
        pos_id: data.pos_id,
      }).then((res) => {
        if (res.data[0][0].errorCode === "Updated") {
          setAlert('Position updated successfully');
          submit();
        } else {
          alert(res.data.errorMsg || 'Failed to update position');
        }
      }).catch((error) => {
        console.error('Error updating position:', error);
        alert('Failed to update position. Please try again.');
      });
    }

    const InsertCall = () => {
      if (!matchId) {
        alert('Please select a match first');
        return;
      }

      axios.post("http://localhost:3001/InsertPos", {
        pos_value: values.pos_name,
        mid: matchId,
      }).then((res) => {
        if (res.data[0][0].msg === "Inserted!") {
          setAlert('Position added successfully');
          submit();
        } else {
          alert(res.data[0][0].msg || 'Failed to add position');
        }
      }).catch((error) => {
        console.error('Error adding position:', error);
        alert('Failed to add position. Please try again.');
      });
    }

    if (update) {
      updateCall();
    } else {
      InsertCall();
    }
    alertTimeOut();
  };
  
  const onclose = () => {
    formik.resetForm();
    onClose();
  };
  
  return (
    <div>
      <Dialog fullScreen open={open} onClose={onClose}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onclose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add Position
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              {button}
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">

          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">POSITION DETAILS</Typography>
            <TextField
              fullWidth
              type="text"
              label="Postion Name"
              variant="outlined"
              {...getFieldProps('pos_name')}
              error={Boolean(touched.pos_name && errors.pos_name)}
              helperText={touched.pos_name && errors.pos_name}
            />
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
