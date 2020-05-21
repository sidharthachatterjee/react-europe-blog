import React from "react"
import { graphql, useStaticQuery } from "gatsby"

export default () => {
  const { site } = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
          author
        }
      }
    }
  `)
  return (
    <footer>
      {site.siteMetadata.title}
      {site.siteMetadata.author}
    </footer>
  )
}
