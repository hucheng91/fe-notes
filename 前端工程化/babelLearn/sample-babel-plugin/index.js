

module.exports = ({ types: t }) => {
    return {
        visitor: {
            Literal: function(path) {
                if (path.node.value !== "Hello") {
                    return
                }
                path.node.value = "Hi"
            },
            Identifier: {
                enter() {
                    console.log("Entered!");
                  },
                  exit() {
                    console.log("Exited!");
                  }
            }
        }
    }
}
