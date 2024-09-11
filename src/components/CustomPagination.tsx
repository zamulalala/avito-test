import React from 'react';
import { Pagination, useTheme, useMediaQuery } from '@mui/material';

interface CustomPaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ count, page, onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Pagination
      variant="outlined"
      count={count}
      page={page}
      onChange={onChange}
      color="secondary"
      size={isMobile ? "small" : "medium"}
      siblingCount={isMobile ? 0 : 1}
      boundaryCount={isMobile ? 1 : 2}
      style={{
        marginTop: "70px",
        display: "flex",
        justifyContent: "center",
      }}
    />
  );
};

export default CustomPagination;