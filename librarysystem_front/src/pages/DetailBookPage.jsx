import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Button, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import bookServices from "../services/bookService";

export default function DetailBookPage() {
  const navigate = useNavigate();
  const { bookId } = useParams();

  const [book, setBook] = useState(null);
  const [rentalId, setRentalId] = useState(null);

  useEffect(() => {
    const loadDetail = async () => {
      const res = await bookServices.fetchBookById(bookId);
      setBook(res);
    };
    loadDetail();
  }, [bookId]);

  if (!book) return <Typography>Loading...</Typography>;

  const handleRent = async () => {
    const res = await bookServices.createLoan({ bookId: Number(bookId), memberId: 1 });
    setRentalId(res.loanId);
    setBook((prev) => ({ ...prev, availableStock: 0 }));
  };

  const handleReturn = async () => {
    await bookServices.returnRental(rentalId);
    setRentalId(null);
    setBook((prev) => ({ ...prev, availableStock: 1 }));
  };

  return (
    <Box maxWidth="750px" mx="auto" display="flex" flexDirection="column" gap={3}>
      <Typography variant="h5">📖 도서 상세 정보</Typography>

      <Paper variant="outlined">
        <img src={book.coverImageUrl} style={{ width: "100%", borderRadius: 6 }} />
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography fontWeight="bold">책 제목</Typography>
        <Typography>{book.title}</Typography>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography fontWeight="bold">저자</Typography>
        <Typography>{book.author}</Typography>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography fontWeight="bold">출판사</Typography>
        <Typography>{book.publisher}</Typography>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography fontWeight="bold">책 소개</Typography>
        <Typography>{book.summary}</Typography>
      </Paper>

      {/* 대출/반납 버튼 */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            disabled={book.availableStock === 0}
            onClick={handleRent}
          >
            대출
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            disabled={rentalId === null}
            onClick={handleReturn}
          >
            반납
          </Button>
        </Grid>
      </Grid>

      <Button variant="contained" color="secondary" onClick={() => navigate(`/book/${bookId}/edit`)}>
        도서 수정
      </Button>

      <Button variant="text" onClick={() => navigate(-1)}>
        뒤로가기
      </Button>
    </Box>
  );
}


