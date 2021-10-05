import React, { useState, useContext, useEffect } from 'react'
import Button from '@mui/material/Button'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import IconButton from '@mui/material/IconButton'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { AuthContext } from '../GlobalStates'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'

import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DateTimePicker from '@mui/lab/DateTimePicker'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'scroll',
  height: '70%',
  display: 'block',
}

function LogTradeModal(props) {
  const [user, setUser] = useContext(AuthContext)
  // const [open, setOpen] = React.useState(false)
  const handleOpen = () => props.setOpen(true)
  const handleClose = () => props.setOpen(false)
  const { values, setValues } = props
  const [dateExecuted, setDateExecuted] = React.useState(new Date())
  // const [side, setSide] = useState(null)

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value })
    // console.log('changing', values)
  }

  function handleSave() {
    let status = ''

    const entry = parseInt(values.entry)
    const exit = parseInt(values.exit)

    const diff = exit - entry
    if (values.side === 'long') {
      if (diff >= 0) {
        status = 'win'
      } else {
        status = 'loss'
      }
    } else {
      if (diff < 0) {
        status = 'win'
      } else {
        status = 'loss'
      }
    }

    const postData = {
      ...values,
      status,
      date_executed: values.date_executed.toString(),
    }
    axios
      .put(
        'https://mfcmf6nqx4.execute-api.us-west-1.amazonaws.com/latest/tradesupdate/',
        postData,
        {
          headers: {
            Authorization: user.access_token,
          },
        }
      )
      .then((response) => {
        // console.log(response)
        props.setOpen(false)
        let filteredRows = props.rows.filter((row) => {
          return row.item_id !== values.item_id
        })
        props.setRows([postData, ...filteredRows])
      })
  }

  function handleSubmit(event) {
    event.preventDefault()
    // console.log('values', values)
    let status = ''

    const entry = parseInt(values.entry)
    const exit = parseInt(values.exit)

    const diff = exit - entry
    if (values.side === 'long') {
      if (diff >= 0) {
        status = 'win'
      } else {
        status = 'loss'
      }
    } else {
      if (diff < 0) {
        status = 'win'
      } else {
        status = 'loss'
      }
    }

    let item_id = uuidv4()
    const postData = {
      ...values,
      status,
      date_executed: values.date_executed.toString(),
      item_id: item_id,
    }
    // console.log('postdata', postData)

    axios
      .post(
        'https://mfcmf6nqx4.execute-api.us-west-1.amazonaws.com/latest/trades',
        postData,
        {
          headers: {
            Authorization: user.access_token,
          },
        }
      )
      .then((response) => {
        // console.log(response)
        props.setOpen(false)
        props.setRows([postData, ...props.rows])
      })
  }

  function generateRandomDate() {
    return new Date(+new Date() - Math.floor(Math.random() * 10000000000))
  }

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function genRandomTrade() {
    let values = {
      item_id: uuidv4(),
      username: user.username,
      date_executed: generateRandomDate().toString(),
      type: randomIntFromInterval(1, 2) === 1 ? 'Forex' : 'Stocks',
      symbol: Math.random().toString(36).substr(2, 4),
      side: randomIntFromInterval(1, 2) === 1 ? 'Long' : 'Short',
      position_size: randomIntFromInterval(1, 10000),
      entry: randomIntFromInterval(1, 5000),
      exit: randomIntFromInterval(1, 5000),
      notes: 'n/a',
    }

    const diff = values.exit - values.entry
    if (values.side === 'long') {
      if (diff >= 0) {
        values.status = 'win'
      } else {
        values.status = 'loss'
      }
    } else {
      if (diff < 0) {
        values.status = 'win'
      } else {
        values.status = 'loss'
      }
    }

    axios
      .post(
        'https://mfcmf6nqx4.execute-api.us-west-1.amazonaws.com/latest/trades',
        values,
        {
          headers: {
            Authorization: user.access_token,
          },
        }
      )
      .then((response) => {
        // console.log(response)
        props.setOpen(false)
        props.setRows([values, ...props.rows])
      })
  }

  return (
    <div>
      <Button
        onClick={handleOpen}
        style={{
          float: 'right',
          marginRight: '10px',
          marginBottom: '5px',
          color: '#bf964e',
        }}
      >
        Log New Trade
      </Button>
      {/* <Button onClick={genRandomTrade}>gen random trade</Button> */}
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <h3>Log new trade</h3>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label='Date Of Trade Execution'
                value={values.date_executed}
                onChange={(newValue) => {
                  setValues({ ...values, date_executed: newValue })
                }}
              />
            </LocalizationProvider>
            <TextField
              margin='normal'
              required
              fullWidth
              value={values.type}
              onChange={handleChange('type')}
              id='type'
              label='Type'
              name='type'
              helperText='i.e. Forex, Stocks, Commodities, Materials'
            />
            <TextField
              margin='normal'
              required
              fullWidth
              value={values.symbol}
              onChange={handleChange('symbol')}
              id='symbol'
              label='Symbol'
              name='symbol'
            />
            <FormLabel component='legend'>Side</FormLabel>
            <RadioGroup
              row
              aria-label='side'
              name='side'
              onChange={handleChange('side')}
              value={values.side}
            >
              <FormControlLabel value='long' control={<Radio />} label='Long' />
              <FormControlLabel
                value='short'
                control={<Radio />}
                label='Short'
              />
            </RadioGroup>

            <TextField
              margin='normal'
              required
              fullWidth
              value={values.position_size}
              onChange={handleChange('position_size')}
              name='position_size'
              label='Position Size'
              type='text'
              id='position_size'
              autoComplete='off'
              helperText='Amount purchased/sold'
            />
            <TextField
              margin='normal'
              required
              fullWidth
              value={values.entry}
              onChange={handleChange('entry')}
              name='entry'
              label='Entry Price'
              type='number'
              id='entry'
              autoComplete='off'
            />
            <TextField
              margin='normal'
              required
              fullWidth
              value={values.exit}
              onChange={handleChange('exit')}
              name='exit'
              label='Exit'
              type='number'
              id='exit'
              autoComplete='off'
            />

            <TextField
              margin='normal'
              required
              fullWidth
              value={values.notes}
              onChange={handleChange('notes')}
              name='notes'
              label='Notes'
              type='text'
              id='notes'
              autoComplete='off'
            />

            {props.values.editing ? (
              <Button
                onClick={handleSave}
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
              >
                Save Edit
              </Button>
            ) : (
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

export default function MyTrades(props) {
  const [user, setUser] = useContext(AuthContext)
  const { rows, setRows } = props
  const { myLastEvalKey, setMyLastEvalKey, myStartKeys, setMyStartKeys } = props

  const [pageIndex, setPageIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [initialValues, setInitialValues] = useState({})
  const [values, setValues] = React.useState({
    side: '',
    type: '',
    symbol: '',
    position_size: '',
    entry: 0,
    exit: 0,
    notes: '',
    date_executed: new Date(),
    username: user.username,
    item_id: '',
  })

  const handleEdit = (row) => {
    setValues({
      ...row,
      date_excuted: Date.parse(row.date_executed),
      editing: true,
    })
    setOpen(true)
  }

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#d9a273',
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }))

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }))

  function CustomizedTables() {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell>Date Executed</StyledTableCell>
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>Side</StyledTableCell>
              <StyledTableCell>Size</StyledTableCell>
              <StyledTableCell>Entry </StyledTableCell>
              <StyledTableCell>Exit </StyledTableCell>
              <StyledTableCell>Status </StyledTableCell>
              <StyledTableCell>Notes </StyledTableCell>
              <StyledTableCell>Submitted By </StyledTableCell>
              <StyledTableCell>Actions </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{row.date_executed}</StyledTableCell>
                <StyledTableCell>{row.type}</StyledTableCell>
                <StyledTableCell>{row.side}</StyledTableCell>
                <StyledTableCell>{row.position_size}</StyledTableCell>
                <StyledTableCell>{row.entry}</StyledTableCell>
                <StyledTableCell>{row.exit}</StyledTableCell>
                <StyledTableCell>{row.status}</StyledTableCell>
                <StyledTableCell>{row.notes}</StyledTableCell>
                <StyledTableCell>{row.username}</StyledTableCell>
                <StyledTableCell>
                  {row.username === user.username ? (
                    <>
                      <IconButton
                        onClick={() => {
                          handleDelete(row.item_id)
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          handleEdit(row)
                        }}
                      >
                        <EditIcon />
                      </IconButton>{' '}
                    </>
                  ) : (
                    <div></div>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  async function handleDelete(item) {
    await axios
      .delete(
        'https://mfcmf6nqx4.execute-api.us-west-1.amazonaws.com/latest/trades/' +
          item,
        {
          headers: {
            Authorization: user.access_token,
          },
        }
      )
      .then((response) => {
        console.log(response)
        let newRows = rows.filter((row) => {
          return row.item_id !== item
        })

        setRows(newRows)
      })
  }

  async function handleNextPage() {
    let apiUrl =
      'https://mfcmf6nqx4.execute-api.us-west-1.amazonaws.com/latest/trades/mytrades/' +
      user.username
    let fetched
    fetched = await axios.get(apiUrl + myLastEvalKey.item_id, {
      headers: {
        Authorization: user.access_token,
      },
    })

    setRows(fetched.data.items)
    setMyLastEvalKey(fetched.data.lastEvaluatedKey)
    setMyStartKeys([...myStartKeys, fetched.data.lastEvaluatedKey])
    setPageIndex(pageIndex + 1)
  }

  async function handlePreviousPage() {
    myStartKeys.pop()
    myStartKeys.pop()

    let apiUrl =
      'https://mfcmf6nqx4.execute-api.us-west-1.amazonaws.com/latest/trades/mytrades/' +
      user.username

    // we are on page 3
    let fetched
    if (myStartKeys.length === 0) {
      fetched = await axios.get(apiUrl, {
        headers: {
          Authorization: user.access_token,
        },
      })
    } else {
      fetched = await axios.get(
        apiUrl + myStartKeys[myStartKeys.length - 1].item_id,
        {
          headers: {
            Authorization: user.access_token,
          },
        }
      )
    }

    // console.log(fetched.data)
    setRows(fetched.data.items)
    setMyLastEvalKey(fetched.data.lastEvaluatedKey)
    setMyStartKeys([...myStartKeys, fetched.data.lastEvaluatedKey])
    setPageIndex(pageIndex - 1)
    // console.log('startkeys', startKeys)
  }

  useEffect(() => {
    props.fetchData()
  }, [props.selectedTab])
  return (
    <>
      <div>
        <LogTradeModal
          setRows={setRows}
          rows={rows}
          open={open}
          setOpen={setOpen}
          values={values}
          setValues={setValues}
        />
        <CustomizedTables />
        {myLastEvalKey ? (
          <Button
            disabled={!myLastEvalKey}
            style={{
              float: 'right',
              marginRight: '10px',
              marginBottom: '5px',
              color: '#bf964e',
            }}
            onClick={handleNextPage}
          >
            Next Page
          </Button>
        ) : (
          <></>
        )}

        {myStartKeys.length > 1 ? (
          <Button
            onClick={handlePreviousPage}
            style={{ float: 'right', marginRight: '10px', marginBottom: '5px' }}
          >
            Previous Page
          </Button>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
