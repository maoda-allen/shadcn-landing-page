# 🧹 Git历史清理指南

## ⚠️ 重要提醒
您的API密钥已经暴露在Git历史中，需要清理历史记录并撤销所有相关密钥。

## 🚨 立即行动步骤

### 1. 撤销所有暴露的API密钥
1. 访问 [OpenRouter Keys 页面](https://openrouter.ai/keys)
2. **删除所有现有的API密钥**
3. 生成全新的API密钥
4. 将新密钥保存到 `.env.local` 文件中

### 2. 清理Git历史（如果是私有仓库）
```bash
# 方法1：使用git filter-branch清理特定文件
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch app/api/generate-party-plan/route.ts' \
  --prune-empty --tag-name-filter cat -- --all

# 方法2：使用BFG Repo-Cleaner（推荐）
# 下载BFG: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --replace-text passwords.txt
git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

### 3. 如果是公共仓库（强烈推荐）
**删除整个仓库并重新创建**：
1. 在GitHub上删除当前仓库
2. 创建新的仓库
3. 重新推送清理后的代码

### 4. 强制推送清理后的历史
```bash
git push origin --force --all
git push origin --force --tags
```

## 🛡️ 预防措施

### 1. 使用环境变量
```bash
# .env.local (不会被提交到Git)
OPENROUTER_API_KEY=sk-or-v1-your-new-api-key-here
```

### 2. 设置Git钩子
创建 `.git/hooks/pre-commit` 文件：
```bash
#!/bin/sh
# 检查是否包含API密钥
if grep -r "sk-or-v1-" --exclude-dir=node_modules --exclude-dir=.git .; then
    echo "❌ 检测到API密钥，提交被阻止！"
    echo "请将API密钥移动到.env.local文件中"
    exit 1
fi
```

### 3. 使用git-secrets工具
```bash
# 安装git-secrets
git secrets --install
git secrets --register-aws
git secrets --add 'sk-or-v1-[A-Za-z0-9]+'
```

## 🔍 验证清理结果
```bash
# 搜索历史中是否还有API密钥
git log --all --full-history -- "*" | grep -i "sk-or-v1"

# 搜索当前代码中是否有硬编码密钥
grep -r "sk-or-v1" --exclude-dir=node_modules --exclude-dir=.git .
```

## ✅ 完成检查清单
- [ ] 撤销所有旧的API密钥
- [ ] 生成新的API密钥
- [ ] 将新密钥保存到.env.local
- [ ] 清理Git历史记录
- [ ] 更新.gitignore文件
- [ ] 设置预提交钩子
- [ ] 验证清理结果
- [ ] 重新部署应用

## 🚨 紧急联系
如果发现API密钥被滥用：
1. 立即访问 [OpenRouter Dashboard](https://openrouter.ai/activity) 检查使用情况
2. 联系OpenRouter支持团队
3. 监控账户余额变化 