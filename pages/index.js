import Canvas from "../components/Canvas";
import Screen from "../components/Screen";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      screenImg: null,
    };
  }

  render() {
    const {screenImg} = this.state;

    return (
      <div>
        {
          screenImg ?
          <Canvas
            img={screenImg}
            /> : null
        }
        <Screen
          ref={(elm) => {
            if (elm && this.state.screenImg === null) {
              this.setState({
                screenImg: elm.getNode(),
              });
            }
          }}
          />
        <style jsx>{`
          div {
            margin: 8px;
          }
        `}</style>
      </div>
    );
  }
}
