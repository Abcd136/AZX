const express = require('express');
const { Octokit } = require("@octokit/rest");
const app = express();
const port = 3000;

// GitHub个人访问令牌
const githubToken = 'your_github_token';
const octokit = new Octokit({ auth: githubToken });

// 你的GitHub仓库信息
const owner = 'your_github_username';
const repo = 'your_repo_name';
const branch = 'main';
const path = 'comments.txt'; // 存储评论的文件路径

app.use(express.json());

app.post('/submit-comment', async (req, res) => {
  const comment = req.body.comment;
  try {
    // 获取文件内容
    const { data: fileContent } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    // 解码文件内容
    const content = Buffer.from(fileContent.content, 'base64').toString();

    // 添加新评论
    const newContent = `${content}\n${comment}`;

    // 创建或更新文件
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      branch,
      message: 'Add new comment',
      content: Buffer.from(newContent).toString('base64'),
    });

    res.send('Comment saved to GitHub');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving comment');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
