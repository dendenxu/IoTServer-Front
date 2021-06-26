import React, { useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';

export default function Loading(props) {
  const { loadingData, scaling = 1 } = props;

  return (
    <>
      {loadingData && (
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            width: '100%',
            // height: '100%',
            paddingTop: '10%',
            top: 0,
          }}
          zIndex={21}
        >
          {/* <LinearProgress /> */}
          <CircularProgress size={68 * scaling} thickness={5.2 * scaling} />
        </Box>
      )}
      {loadingData && (
        <Box
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            backdropFilter: `${loadingData ? 'blur(5px)' : 'blur(0)'}`,
          }}
          position="absolute"
          top={0}
          left={0}
          zIndex={10}
        />
      )}
    </>
  );
}
