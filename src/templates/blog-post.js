import React from "react"
import { graphql } from "gatsby"

export default ({ data }) => {
  return (
    <article>
      <h1>{data.blogPost.title}</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: data.blogPost.content,
        }}
      />
    </article>
  )
}

export const query = graphql`
  query BlogPostQuery($title: String) {
    blogPost(title: { eq: $title }) {
      title
      slug
      content
    }
  }
`
