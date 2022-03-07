import { Global } from "@emotion/react";
import * as React from 'react'

export const Fonts = () => (
    <Global
        styles={`
        @font-face {
        font-family: 'Roobert';
        font-weight:600;
        font-display:block;
        src: url('/fonts/Roobert-Medium.ttf') format("truetype");
        }
        @font-face {
        font-family: 'Roobert';
        font-weight:400;
        font-display:block;
        src: url('/fonts/Roobert-Regular.otf') format("opentype");
        }
    `}
    />
)