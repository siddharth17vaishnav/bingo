"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function BingoApp() {
  const [board, setBoard] = useState<number[][]>([]);
  const [markedNumbers, setMarkedNumbers] = useState<Set<number>>(new Set());
  const [completedLines, setCompletedLines] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);

  useEffect(() => {
    generateNewBoard();
  }, []);

  useEffect(() => {
    const lines = checkBingo();
    setCompletedLines(lines);
    if (lines >= 5 && !isGameWon) {
      setIsGameWon(true);
    }
  }, [markedNumbers]);

  const generateNewBoard = () => {
    const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
    const shuffled = numbers.sort(() => Math.random() - 0.5);
    const newBoard: number[][] = [];

    for (let i = 0; i < 5; i++) {
      newBoard.push(shuffled.slice(i * 5, (i + 1) * 5));
    }

    setBoard(newBoard);
    setMarkedNumbers(new Set());
    setCompletedLines(0);
    setIsGameWon(false);
  };

  const toggleNumber = (num: number) => {
    if (isGameWon) return; // Prevent further moves if game is won

    setMarkedNumbers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(num)) {
        newSet.delete(num);
      } else {
        newSet.add(num);
      }
      return newSet;
    });
  };

  const checkBingo = () => {
    let lines = 0;

    // Check rows
    for (const row of board) {
      if (row.every((num) => markedNumbers.has(num))) lines++;
    }

    // Check columns
    for (let i = 0; i < 5; i++) {
      if (board.every((row) => markedNumbers.has(row[i]))) lines++;
    }

    // Check diagonals
    if (board.every((row, i) => markedNumbers.has(row[i]))) lines++;
    if (board.every((row, i) => markedNumbers.has(row[4 - i]))) lines++;

    return lines;
  };

  return (
    <div className="h-screen w-screen flex justify-center align-item-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Bingo (1-25)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {board.map((row, i) =>
              row.map((num, j) => (
                <Button
                  key={`${i}-${j}`}
                  variant={markedNumbers.has(num) ? "default" : "outline"}
                  className={`w-12 h-12 p-0 ${
                    markedNumbers.has(num)
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                  onClick={() => toggleNumber(num)}
                  aria-pressed={markedNumbers.has(num)}
                  disabled={isGameWon}
                >
                  {num}
                </Button>
              ))
            )}
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progress:</span>
              <span className="text-sm font-medium">
                {completedLines} / 5 lines
              </span>
            </div>
            <Progress value={completedLines * 20} className="w-full" />
            <div className="flex justify-between items-center">
              <Button onClick={generateNewBoard}>New Game</Button>
              {isGameWon && (
                <span className="text-xl font-bold text-green-600" role="alert">
                  BINGO! You won!
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
