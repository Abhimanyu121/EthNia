import React from "react";
import {
  Collapse,
  Container,
  Row,
  FormInput,
  Button,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormTextarea,
  Badge,
} from "shards-react";
import Travel from "./contracts/Travel.json";
import getContractInstance, { web3DataFetch } from "./utils.js";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
var ipfsClient = require("ipfs-http-client");

type State = {
  hasLocation: boolean,
  latlng: {
    lat: number,
    lng: number,
  },
};

export default class CreateReview extends React.Component<{}, State> {
  captureFile(event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({ added_file_hash: event.target.files });
  }

  runExample = async () => {
    var ipfs = ipfsClient("ipfs.infura.io", "5001", { protocol: "https" });
    let ipfsId;
    ipfs
      .add([...this.state.added_file_hash], {
        progress: (prog) => console.log(`received: ${prog}`),
      })
      .then(async (response) => {
        console.log(response);
        ipfsId = response[0].hash;
        console.log(ipfsId);
        const { accounts, contract } = this.state;
        let content = JSON.stringify({
          subject: this.state.subject,
          details: this.state.details,
          ipfsId: ipfsId,
        });
        await contract.methods
          .add_posts(content, JSON.stringify(this.state.latlng))
          .send({ from: accounts[0] });
        this.setState({});
      })
      .catch((err) => {
        console.error(err);
      });

    console.log(this.state.latlng);
    //this.setState({subject:'',details:'',name:''}, this.getApplications);
  };

  componentDidMount = async () => {
    const obj = await web3DataFetch();
    console.log("objasdfasd", obj);
    this.setState({
      web3: obj.web3,
      accounts: obj.accounts,
      contract: obj.contract,
    });
  };
  mapRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      subject: "",
      details: "",
      web3: null,
      accounts: null,
      contract: null,
      hasLocation: false,
      latlng: {
        lat: 51.505,
        lng: -0.09,
      },
      added_file_hash: null,
    };

    this.handleInput = this.handleInput.bind(this);
    this.runExample = this.runExample.bind(this);
    this.captureFile = this.captureFile.bind(this);
  }

  handleClick = () => {
    const map = this.mapRef.current;
    if (map != null) {
      map.leafletElement.locate();
    }
  };

  handleLocationFound = (e: Object) => {
    this.setState({
      hasLocation: true,
      latlng: e.latlng,
    });
  };

  handleInput(event) {
    const target = event.target;
    if (target.name == "subject") {
      this.setState(Object.assign({}, this.state, { subject: target.value }));
    } else if (target.name == "details") {
      this.setState(Object.assign({}, this.state, { details: target.value }));
    } else {
      this.setState(Object.assign({}, this.state, { name: target.value }));
    }
  }
  render() {
    console.log("this.state.contract", this.state.contract);
    const marker = this.state.hasLocation ? (
      <Marker position={this.state.latlng}>
        <Popup>You are here</Popup>
      </Marker>
    ) : null;
    return (
      <div>
        {this.state.contract ? (
          <Container className="main-container">
            <Row>
              <Col sm="12" md="12">
                <div>
                  <h3>Add New Place</h3>
                  <hr /> <br />
                  <Card>
                    <CardHeader>Enter The Details Of Place</CardHeader>
                    <CardBody>
                      <CardTitle>A Catchy Title</CardTitle>
                      <FormInput
                        name="subject"
                        placeholder="Name of Place"
                        value={this.state.subject}
                        onChange={this.handleInput}
                      />
                      <br />
                      <CardTitle>Why is it Awesome </CardTitle>
                      <FormTextarea
                        name="details"
                        value={this.state.details}
                        onChange={this.handleInput}
                        placeholder="Enter Place Details"
                      />
                      <br />
                      <CardTitle>Where Is It</CardTitle>
                      <Map
                        center={this.state.latlng}
                        length={4}
                        onClick={this.handleClick}
                        onLocationfound={this.handleLocationFound}
                        ref={this.mapRef}
                        zoom={13}
                      >
                        <TileLayer
                          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {marker}
                      </Map>
                      <br />
                      <CardTitle>Give Us Some Images</CardTitle>
                      <FormInput
                        type="file"
                        theme="danger"
                        onChange={this.captureFile}
                        placeholder="Upload an Image"
                        className="form-control"
                      />
                      <br /> <br />
                      <center>
                        <Button theme="success" onClick={this.runExample}>
                          Submit
                        </Button>
                      </center>
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }
}
