const kebabcase = require("lodash.kebabcase")

module.exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(
    `
    interface BlogPost @nodeInterface {
      id: ID!
      title: String!
      slug: String!
      content: String!
    }
    type MarkdownRemark implements BlogPost & Node {
      title: String! @proxy(from: "frontmatter.title")
      slug: String! @proxy(from: "fields.slug")
      content: String!
    }
    type ContentfulBlogPost implements BlogPost & Node {
      title: String!
      slug: String!
      content: String!
    }
    `
  )
}

module.exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    MarkdownRemark: {
      content: {
        resolve: async (source, args, context, info) => {
          const fieldName = "html"
          const type = info.schema.getType(`MarkdownRemark`)
          const resolver = type.getFields()[fieldName].resolve
          const result = await resolver(source, args, context, {
            fieldName,
          })
          return result
        },
      },
    },
    ContentfulBlogPost: {
      content: {
        resolve: async (source, args, context, info) => {
          // const node = context.nodeModel.getNodeById({
          //   id: source.body.childMarkdownRemark.id,
          // })
          // const fieldName = "html"
          // const type = info.schema.getType(`ContentfulBlogPost`)
          // const resolver = type.getFields()[fieldName].resolve
          // const result = await resolver(node, args, context, {
          //   fieldName,
          // })
          // return result
        },
      },
    },
  })
}

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
