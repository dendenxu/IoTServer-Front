import React from 'react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

export default function BottomBar(props) {
  const { className, spaceOut = false } = props;
  return (
    <Grid container spacing={2} className={className}>
      <Grid item xs={spaceOut}>
        <Link
          color="textSecondary"
          href="https://neon-cubes.xyz"
          variant="body2"
        >
          Help
        </Link>
      </Grid>
      <Grid item>
        <Link
          color="textSecondary"
          href="https://neon-cubes.xyz"
          variant="body2"
        >
          Terms
        </Link>
      </Grid>
      <Grid item>
        <Link
          color="textSecondary"
          href="https://neon-cubes.xyz"
          variant="body2"
        >
          Privacy
        </Link>
      </Grid>
    </Grid>
  );
}
