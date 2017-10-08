export default class extends React.Component {
  getNode() {
    return this.img;
  }

  render() {
    return (
      <img
        src="/static/screen.png"
        ref={(elm) => {
          if (elm) {
            this.img = elm;
          }
        }}
        style={{
          display: "none"
        }}
        >
      </img>
    );
  }
}
