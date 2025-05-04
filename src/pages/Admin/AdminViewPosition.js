import { filter } from 'lodash';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import AddPosition from '../Position/AddPosition';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import Axios from 'axios';

// material
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

// components
import Page from '../../components/Page';
// import Label from '../../components/label';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/iconify';
import SearchNotFound from '../../components/SearchNotFound';
import { UserListHead,  UserMoreMenu } from '../../sections/@dashboard/user';
import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, OutlinedInput, InputAdornment } from '@mui/material';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', alignRight: false },
  { id: 'PositonName', label: 'Position Name', alignRight: false },
  { id: '', alignRight: false },
];

// ----------------------------------------------------------------------


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.player_fname.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}


export default function AdminViewPosition() {
  const navigate = useNavigate()
  const ref = useRef(null);

  const handleClose = () => {
    setDialog();
  };
  const [USERLIST, setUserList] = useState([]);
  const [MacthDetails, setMacthDetails] = useState([]);
  const location = useLocation();
  const [selectedMatch, setSelectedMatch] = useState("");


  const mid = localStorage.getItem("MatchID");
  const display = () => {

    if (selectedMatch == "") return;
    console.log(selectedMatch);
    axios.post("http://localhost:3001/getPos", {
      mid: selectedMatch
    }).then((res) => {
      console.log(res);
      if (res.data) {
        console.log(res);
        setUserList(res.data[0]);
      }
      else {
        setUserList([]);
      }
    }).catch((error) => {
      console.log(error);
      console.log('No internet connection found. App is running in offline mode.');
    });
  }

  useEffect(() => {
    console.log("refreshing")
    display();
    getMatch();
  }, [selectedMatch])




  const getMatch = () => {

    Axios.post("http://localhost:3001/matchDetailsadmin", {
    }).then((response) => {
      if (response.data.length > 0) {
        console.log(response.data[0])
        setMacthDetails(response.data[0])
      }
      else {
        console.log("No data!");
        setMacthDetails([]);
      }
    });
  }
  const [open, setOpen] = useState(true);



  const [addDialog, setDialog] = useState();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
    const add = () => {
      setOpen(false);
      setDialog();
      display();
    };
    setDialog(() => (
      <AddPosition
        onClose={handleClose}
        open={open}
        submit={add}
        updated={upd}
        button={button}
        data={data}
      />
    ));
    setOpen(true);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const  UserListToolbar = ({ numSelected, filterName, onFilterName }) => {
    return (
      <StyledRoot
        sx={{
          ...(numSelected > 0 && {
            color: 'primary.main',
            bgcolor: 'primary.lighter',
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography component="div" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <StyledSearch
            value={filterName}
            onChange={onFilterName}
            placeholder="Search user..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
        )}
                  <Select
                  width={100}
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label="Matches"
            value=""
            onChange={(e) => {
              console.log(e)
              setSelectedMatch(e.target.value)
            }}
          >

            {MacthDetails.map((data) => {
              return (
                <MenuItem value={data.match_id}>
                  {data.matchfname} {data.matchlname}
                </MenuItem>
              );

            })}
          </Select>
  
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <Iconify icon="eva:trash-2-fill" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip>
        )}
      </StyledRoot>
    );
  }

  UserListToolbar.propTypes = {
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
  };
   


  const StatusMenu = (prop) => {
    const ref = useRef(null)
    const [isOpen, setIsOpen] = useState(false);
    const dl = () => {
      axios.post("http://localhost:3001/delPos", {
        pos_id: prop.aid,
      }).then((res) => {
        display();
      }).catch(() => {
        console.log('No internet connection found. App is running in offline mode.');
      })
    }
    return (
      <>
        <IconButton ref={ref} onClick={() => setIsOpen(true)}>
          <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
        </IconButton>
        <Menu
          open={isOpen}
          anchorEl={ref.current}
          onClose={() => setIsOpen(false)}
          PaperProps={{
            sx: { width: 200, maxWidth: '100%' },
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Iconify icon="eva:edit-fill" width={24} height={24} />
            </ListItemIcon>
            <ListItemText onClick={(e) => handleAdd(e, true, 'EDIT', prop.row)} primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => {
            console.log("Clicked:" + prop.aid);
            dl();
          }}>
            <ListItemIcon>
              <Iconify icon="el:remove-circle" width={24} height={24} color='#cc2900' />
            </ListItemIcon>
            <ListItemText primary="Remove" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        </Menu>
      </>);
  }
  



  return (
    <Page title="Positions">
      <Container maxWidth="xl">
        {addDialog}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Position
          </Typography>
          <Button variant="contained" component={RouterLink} to="#" onClick={handleAdd} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Position
          </Button>
        </Stack>
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers && filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { pos_id, pos_name } = row;

                    return (
                      <TableRow key={pos_id}>

                        <TableCell align='left'>

                        </TableCell>
                        <TableCell align='left'>
                          {pos_name}
                        </TableCell>

                        <TableCell align="right" >
                          {/* <StatusMenu key={pos_id}  ref={ref} aid={pos_id} row={row} /> */}
                        </TableCell>
                      </TableRow>
                    );

                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}


// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------