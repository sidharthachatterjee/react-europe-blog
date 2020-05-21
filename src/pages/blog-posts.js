import React from "react"
import { graphql, Link } from "gatsby"

export default ({ data }) => {
  return (
    <ul>
      {data.allBlogPost.nodes.map(post => (
        <li>
          <Link to={`/blog-posts/${post.slug}`}>
            <h4>{post.title}</h4>
          </Link>
          {/* <p>{post.excerpt}</p> */}
        </li>
      ))}
    </ul>
  )
}

export const query = graphql`
  {
    allBlogPost(filter: { title: { ne: "" } }) {
      nodes {
        title
        slug
      }
    }
  }
`
