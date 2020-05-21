import React from "react"
import { graphql, Link } from "gatsby"

export default ({ data }) => {
  return (
    <ul>
      {data.allMarkdownRemark.nodes.map(post => (
        <li>
          <Link to={`/blog-posts/${post.fields.slug}`}>
            <h4>{post.frontmatter.title}</h4>
          </Link>
          <p>{post.excerpt}</p>
        </li>
      ))}
    </ul>
  )
}

export const query = graphql`
  {
    allMarkdownRemark(filter: { frontmatter: { title: { ne: "" } } }) {
      nodes {
        frontmatter {
          title
        }
        fields {
          slug
        }
        excerpt
      }
    }
  }
`
