import { Global } from "@emotion/react";
import * as React from 'react'

export const Fonts = () => (
    <Global
        styles={`
        @font-face {
        font-family: 'Roobert';
        font-weight:600;
        src: url('/Roobert-SemiBold.ttf') format("truetype");
        }
        @font-face {
        font-family: 'Roobert';
        font-weight:400;
        src: url('/Roobert-Medium.ttf') format("truetype");
        }
    `}
    />
)