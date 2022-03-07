import { extendTheme } from "@chakra-ui/react"

export const theme = extendTheme({
    fonts: {
        heading: "Roobert",
        body: "Roobert",
    },
    colors: {
        brand: {
            100: "#f4f6fa",
            200: "#FE7886",
            300: "#ACFFDC",
            400: "#FCE86B",
            900: "#1a202c",
        },
    },
    breakpoints: {
        sm: "36em",
        md: "48em",
        lg: "62em",
        pxl: "70em",
        xl: "80em",
        "2xl": "96em",
    },
    styles: {
        global: {
          'h2': {
            letterSpacing:"-0.01em"
          },
          'p': {
            letterSpacing:"0.2px"
          },
        },
      },
})