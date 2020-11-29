import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import {hammingEncode, hammingDecode} from './hamming-code.js'
import HammingCode from './components/HammingCode';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch'
    }
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

function App() {
  const classes = useStyles();

  console.log(hammingEncode('1011', 0));
  console.log(hammingDecode('011100101011', 0));

  const [data, setData] = React.useState('');
  const [codeword, setCodeword] = React.useState('');
  const [parity, setParity] = React.useState(0);

  const [showHammingCode, setShowHammingCode] = React.useState(false);

  return (<React.Fragment>
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon/>
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Hamming Code Demo
        </Typography>
      </Toolbar>
    </AppBar>
    <Typography variant="h4" className={classes.root}>Input</Typography>
    <form className={classes.root} noValidate="noValidate" autoComplete="off">
      <div>
        <TextField label="Data" name="data" value={data} onChange={e => setData(e.target.value)} placeholder="eg. 1101" variant="filled" InputLabelProps={{
            shrink: true
          }}/>
        <TextField label="Codeword" name="codeword" value={codeword} onChange={e => {setCodeword(e.target.value);setShowHammingCode(true)}} placeholder="eg. 0110011" variant="filled" InputLabelProps={{
            shrink: true
          }}/>
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel shrink="shrink" id="select-parity-label" variant="filled">Parity</InputLabel>
          <Select labelId="select-parity-label" id="select-parity" value={parity} onChange={e => setParity(e.target.value)} displayEmpty="displayEmpty">
            <MenuItem value={0}>Even</MenuItem>
            <MenuItem value={1}>Odd</MenuItem>
          </Select>
        </FormControl>
      </div>
    </form>

    {
      showHammingCode
        ? <div>
            <Typography variant="h4" className={classes.root}>Output</Typography>
            <HammingCode data={data} codeword={codeword} parity={parity}/>
          </div>
        : null
    }

  </React.Fragment>);
}

export default App;
