import { Global } from "@emotion/react";
import * as React from 'react'

export const Fonts = () => (
    <Global
        styles={`
        @font-face {
        font-family: 'Roobert';
        font-weight: 400;
        font-style: normal;
        font-display: swap;
        src: url("//db.onlinewebfonts.com/t/6228016f2b172c06410f3a2356d33f6c.ttf") format("truetype");
        }
        @font-face {
        font-family: 'Roobert';
        font-weight: 600;
        font-style: normal;
        font-display: swap;
        src: url("//db.onlinewebfonts.com/t/81ba715f5c0ab761390fc25108b11448.ttf") format("truetype");
        }
        
    `}
    />
)