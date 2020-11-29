import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = (theme) => ({
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
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white, // theme.palette.error.main,
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

class HammingCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataBits: 0,
      parityBits: 0,
      parityBitsMax: 0,
      totalBits: 0,
      rawCodeword: [],
      bitPositions: [],
      bitLabels: [],
      parityBitCalculations: {},
      correctedCodeword: []
    };
  }

  updateAndNotify = () => {}

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      //
    } else if (prevProps.codeword !== this.props.codeword) {
      this.generateStateFromCodeword(this.props.codeword.split(''), this.props.parity);
    } else if (prevProps.parity !== this.props.parity) {
      // Parity
    }
  }

  render() {

    const {classes, theme} = this.props;

    return (<React.Fragment>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell>Data bits:</TableCell>
              <TableCell>{this.state.dataBits}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Parity bits:</TableCell>
            <TableCell>{`${this.state.parityBits} (up to ${this.state.parityBitsMax} data bits)`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total bits:</TableCell>
              <TableCell>{this.state.totalBits}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <p>Summary:</p>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="hamming code table">
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="row">Codeword:</TableCell>
              {this.state.rawCodeword.map(bit => (<TableCell>{bit}</TableCell>))}
            </TableRow>
            <TableRow>
              <StyledTableCell component="th" scope="row">Bit Position:</StyledTableCell>
              {this.state.bitPositions.map(bitPosition => (<StyledTableCell>{bitPosition}</StyledTableCell>))}
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row"></TableCell>
              {this.state.bitLabels.map(label => (<TableCell>{label}</TableCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              Object.keys(this.state.parityBitCalculations).map(key => (<TableRow key={key}>
                <TableCell component="th" scope="row">{key}</TableCell>
                {this.state.parityBitCalculations[key].map(bit => (<TableCell>{bit}</TableCell>))}
              </TableRow>))
            }

            {
              // {
              //   rows.map((row) => (<TableRow key={row.name}>
              //     <TableCell component="th" scope="row">
              //       {row.name}
              //     </TableCell>
              //     <TableCell align="right">{row.calories}</TableCell>
              //     <TableCell align="right">{row.fat}</TableCell>
              //     <TableCell align="right">{row.carbs}</TableCell>
              //     <TableCell align="right">{row.protein}</TableCell>
              //   </TableRow>))
              // }
            }
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>);
  }

  // Decode hamming codeword
  generateStateFromCodeword = (codeword, parity) => {
    // Parse codeword using Hamming Algorithm

    // Number of parity bits
    let numberOfParityBits = 0;
    // Sum of erroneous parity bits which will be used in error correction
    let erroneousParityBitSum = 0;
    // And start building the parityBitCalculationsResult
    let parityBitCalculations = {};

    // Loop through each parity bit and check the parity!
    for (let i = 1; i <= codeword.length; i *= 2) {
      numberOfParityBits++;

      // Pick out the bits that this parity bit operates on
      // (Parity bit 'P3' operates on all items index that have 1 in the '2^3' bit position)
      const relevantBits = codeword.filter((currentValue, index) => (index + 1) & i);

      // Calculate parity value by xoring each relevant bit
      let parityValue = relevantBits.reduce((accumulator, currentValue) => accumulator ^ currentValue);

      // Check whether it's correct
      if (parityValue !== parity) {
        erroneousParityBitSum += i;
      }

      parityBitCalculations[`P${1 << numberOfParityBits-1}`] = codeword.map((currentValue, index) => ((index + 1) & i) ? currentValue : '');
      parityBitCalculations[`P${1 << numberOfParityBits-1}`].push(parityValue);
    }

    console.log(erroneousParityBitSum);

    let correctedCodeword = [...codeword];
    if (erroneousParityBitSum > 0)
      correctedCodeword[erroneousParityBitSum - 1] ^= 1;

    console.log('before: ', codeword.join(''));

    let data = [];

    let parityBit = 1;
    for (let i = 1; i <= correctedCodeword.length; i++) {
      if (i === parityBit) {
        // It's a parity bit. Ignore
        parityBit *= 2;
        // Update parity bit to next one
      } else {
        data.push(correctedCodeword[i - 1]);
      }
    }

    console.log('after: ', data.join(''));

    this.setState({
      dataBits: data.length,
      parityBits: numberOfParityBits,
      parityBitsMax: 0,
      totalBits: codeword.length,
      rawCodeword: codeword,
      bitPositions: codeword.map((bit, index) => index + 1),
      bitLabels: this.getBitLabels(codeword),
      parityBitCalculations: parityBitCalculations,
      correctedCodeword: correctedCodeword
    });
  }

  getBitLabels = (codeword) => {
    let toReturn = [];

    let parityBit = 1;
    let dataBit = 1;

    for (let i = 1; i <= codeword.length; i++) {
      if (i === parityBit) {
        toReturn.push(`P${parityBit}`);
        parityBit *= 2;
      } else {
        toReturn.push(`D${dataBit}`);
        dataBit++;
      }
    }

    return toReturn;
  }
}

export default withStyles(styles, {withTheme: true})(HammingCode);
