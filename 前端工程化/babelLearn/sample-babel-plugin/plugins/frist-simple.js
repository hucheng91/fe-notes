

/**
 * 一个最简单的 Babel 插件
 */
module.exports = ({ types: t }) => {
    return {
        visitor: {
            BinaryExpression(path) {
                if (path.node.operator !== "===") {
                    return;
                }

                path.node.left = t.identifier("sebmck");
                path.node.right = t.identifier("dork");
            }
        }
    }
}
