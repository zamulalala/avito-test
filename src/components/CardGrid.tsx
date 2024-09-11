import React from 'react';
import { Box } from '@mui/material';

interface CardGridProps {
  children: React.ReactNode;
  itemCount: number;
}

const CardGrid: React.FC<CardGridProps> = ({ children, itemCount }) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "repeat(1, 1fr)",
        sm: "repeat(2, 1fr)",
        md: `repeat(auto-fit, minmax(250px, ${
          itemCount < 3 ? "400px" : "1fr"
        }))`,
      }}
      gap={3}
      sx={{
        justifyContent: {
          xs: "center",
          sm: itemCount === 1 ? "center" : "start",
          md: itemCount < 3 ? "center" : "start",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default CardGrid;