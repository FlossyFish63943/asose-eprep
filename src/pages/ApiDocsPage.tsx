import React from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
    <code className="font-mono text-sm text-muted-foreground">{children}</code>
  </pre>
);
export function ApiDocsPage() {
  useDocumentTitle('ePrep - API Docs');
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-foreground">
          API Documentation
        </h1>
        <p className="text-lg text-muted-foreground">
          Details on the available API endpoints for ASOSE ePrep.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell><Badge variant="outline">GET</Badge></TableCell>
                <TableCell className="font-mono">/api/quizzes</TableCell>
                <TableCell>Returns a list of all available quizzes (ID and title only).</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge variant="outline">GET</Badge></TableCell>
                <TableCell className="font-mono">/api/quizzes/:id</TableCell>
                <TableCell>Returns the full data for a single quiz, including all questions.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge variant="default" className="bg-blue-600 hover:bg-blue-700">POST</Badge></TableCell>
                <TableCell className="font-mono">/api/quizzes/:id/submit</TableCell>
                <TableCell>Submits quiz answers and returns the score.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge variant="outline">GET</Badge></TableCell>
                <TableCell className="font-mono">/api/leaderboard</TableCell>
                <TableCell>Returns the current leaderboard rankings.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge variant="destructive">POST</Badge></TableCell>
                <TableCell className="font-mono">/api/leaderboard/reset</TableCell>
                <TableCell>Admin-only endpoint to reset the leaderboard. Requires a secret key.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Example Usage: Submitting a Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>To submit answers for a quiz, send a POST request to <code className="font-mono bg-muted px-1 py-0.5 rounded">/api/quizzes/cs-fundamentals/submit</code> with a JSON body like this:</p>
          <CodeBlock>
{`{
  "name": "Aaron",
  "answers": [0, 2, 0]
}`}
          </CodeBlock>
          <p>The response will look like this:</p>
          <CodeBlock>
{`{
  "success": true,
  "data": {
    "score": 3,
    "total": 3,
    "scoreUpdated": true
  }
}`}
          </CodeBlock>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-semibold text-lg">How can I see the 404 Not Found page?</h3>
          <p className="text-muted-foreground">
            You can trigger the 404 page by navigating to any URL that does not exist. For example, try visiting a random path like <code className="font-mono bg-muted px-1 py-0.5 rounded">/this-page-does-not-exist</code> in your browser's address bar.
          </p>
        </CardContent>
      </Card>
      <div className="text-center">
        <Button onClick={() => navigate('/')} variant="outline">
          <Home className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </div>
    </motion.div>
  );
}