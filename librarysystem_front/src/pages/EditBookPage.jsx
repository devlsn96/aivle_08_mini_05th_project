import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import bookServices from "../services/bookService";

export default function EditBookPage() {
  const navigate = useNavigate();
  const { bookId } = useParams();

  const [book, setBook] = useState(null);
  const [aiImages, setAiImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 📌 상세정보 불러오기
  useEffect(() => {
    const loadBook = async () => {
      const res = await bookServices.fetchBookById(bookId);
      setBook(res);
    };
    loadBook();
  }, [bookId]);

  if (!book) return <Typography>Loading...</Typography>;

  const buildPrompt = () =>
    `Create a book cover illustration based on this summary:\n\n${book.summary}`;// 프롬프트 별도 만들기

  // 📌 AI 이미지 재생성
  const handleRegenerateImage = async () => {
    if (!book.summary.trim()) {
      alert("summary는 필수입니다.");
      return;
    }

    setLoading(true);
    try {
      const prompt = buildPrompt();
      const result = await bookServices.generateBookImage(prompt);

      let urls = [];
      if (typeof result === "string") urls = [result];
      else if (result.imageUrl) urls = [result.imageUrl];
      else if (Array.isArray(result.data)) urls = result.data.map((img) => img.url);

      setAiImages(urls);
    } catch (err) {
      console.error(err);
      alert("이미지 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  // 📌 수정 API 호출
  const handleUpdate = async () => {
    const payload = {
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      summary: book.summary,
      coverImageUrl: book.coverImageUrl,
    };

    await bookServices.updateBook(bookId, payload);
    alert("수정 완료");
    navigate(`/book/${bookId}`);
  };

  return (
    <Box maxWidth="750px" mx="auto" display="flex" flexDirection="column" gap={3}>
      <Typography variant="h5">📘 도서 수정</Typography>

      <TextField label="책 제목" fullWidth value={book.title} onChange={(e) => setBook({ ...book, title: e.target.value })} />
      <TextField label="저자" fullWidth value={book.author} onChange={(e) => setBook({ ...book, author: e.target.value })} />
      <TextField label="출판사" fullWidth value={book.publisher} onChange={(e) => setBook({ ...book, publisher: e.target.value })} />
      <TextField
        label="책 소개 (summary)"
        fullWidth
        multiline
        rows={4}
        value={book.summary}
        onChange={(e) => setBook({ ...book, summary: e.target.value })}
      />

      {/* 이미지 선택 */}
      {aiImages.length > 0 && (
        <Grid container spacing={2}>
          {aiImages.map((img, idx) => (
            <Grid item xs={3} key={idx}>
              <Paper
                onClick={() => setBook({ ...book, coverImageUrl: img })}
                sx={{
                  border: book.coverImageUrl === img ? "3px solid #1976d2" : "1px solid #ccc",
                  cursor: "pointer",
                  p: 1,
                }}
              >
                <img src={img} width="100%" />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Button variant="outlined" onClick={handleRegenerateImage}>
        {loading ? "생성 중..." : "이미지 재생성"}
      </Button>

      <Button variant="contained" onClick={handleUpdate}>
        수정 완료
      </Button>

      <Button variant="text" onClick={() => navigate(-1)}>
        뒤로가기
      </Button>
    </Box>
  );
}
