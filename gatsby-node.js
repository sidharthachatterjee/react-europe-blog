const kebabcase = require("lodash.kebabcase")

module.exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    createNodeField({
      node,
      name: "slug",
      value: kebabcase(node.frontmatter.title),
    })
  }
}

module.exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions
  const blogPostTemplate = require.resolve(`./src/templates/blog-post.js`)

  const { data } = await graphql(`
    {
      allMarkdownRemark(filter: { frontmatter: { title: { ne: "" } } }) {
        nodes {
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
      }
    }
  `)

  data.allMarkdownRemark.nodes.forEach(post => {
    createPage({
      name: post.frontmatter.title,
      path: `/blog-posts/${post.fields.slug}`,
      component: blogPostTemplate,
      context: {
        title: post.frontmatter.title,
      },
    })
  })
}
