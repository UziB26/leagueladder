# Dual Deployment Guide: Vercel + AWS Amplify

## 🎯 Current Status

✅ **Vercel**: Active and working (production)
✅ **AWS Amplify**: Ready to deploy (testing)

Both platforms can run simultaneously without conflicts.

## 📁 Configuration Files

### For Vercel (Kept Active):
- ✅ `vercel.json` - Vercel build configuration
- ✅ Environment variables in Vercel Dashboard

### For AWS Amplify (New):
- ✅ `amplify.yml` - Amplify build configuration
- ✅ Environment variables in Amplify Console

### Shared (Works for Both):
- ✅ `next.config.ts` - Next.js configuration
- ✅ `prisma.config.ts` - Updated to support both platforms
- ✅ `package.json` - Dependencies work for both

## 🔄 How Dual Deployment Works

1. **GitHub Push** → Both platforms detect changes
2. **Vercel** → Uses `vercel.json`, deploys automatically
3. **AWS Amplify** → Uses `amplify.yml`, deploys automatically
4. **Both Active** → Different URLs, same codebase

## 🌐 URLs

- **Vercel**: `https://leagueladderapp.vercel.app`
- **AWS Amplify**: `https://main.xxxxx.amplifyapp.com` (after setup)

## 🔐 Environment Variables

### Vercel (Keep As-Is):
- Uses Vercel Postgres connection strings
- `NEXTAUTH_URL` = Vercel URL
- All existing variables remain

### AWS Amplify (New):
- Uses AWS RDS connection strings
- `NEXTAUTH_URL` = Amplify URL
- Same secrets (for session compatibility)

## ✅ Verification Checklist

### Before Starting Amplify Setup:
- [ ] `vercel.json` is still in repo (✅ Verified)
- [ ] Vercel deployment is working
- [ ] All features tested on Vercel

### After Amplify Setup:
- [ ] Amplify build succeeds
- [ ] Amplify app loads
- [ ] Database connection works
- [ ] All features work on Amplify
- [ ] Vercel still works (verify it still deploys)

## 🚨 Important Notes

1. **Don't Remove `vercel.json`** until migration is complete
2. **Different Databases**: Vercel uses Vercel Postgres, Amplify uses AWS RDS
3. **Same Secrets**: Use same `NEXTAUTH_SECRET` for session compatibility
4. **Test Thoroughly**: Verify Amplify works 100% before switching
5. **Keep Both Active**: Use dual deployment as backup during transition

## 📊 Monitoring Both Deployments

### Vercel:
- Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Check deployments tab
- Monitor function logs

### AWS Amplify:
- Console: [console.aws.amazon.com/amplify](https://console.aws.amazon.com/amplify)
- Check build history
- Monitor application logs

## 🔄 Switching Strategy

### Phase 1: Setup (Now)
- ✅ Create Amplify deployment
- ✅ Test thoroughly
- ✅ Keep Vercel active

### Phase 2: Testing (1-2 weeks)
- Monitor both deployments
- Compare performance
- Fix any Amplify issues

### Phase 3: Switch (When Ready)
- Update DNS (if using custom domain)
- Or update all references to Amplify URL
- Keep Vercel as backup for a while

### Phase 4: Cleanup (Optional)
- Remove Vercel deployment (if desired)
- Or keep as backup
- Update documentation

## 🆘 Rollback Plan

If Amplify has issues:
1. **Vercel is still active** - no downtime
2. Point traffic back to Vercel
3. Fix Amplify issues
4. Try again

## 📝 Next Steps

1. **Follow `AWS_AMPLIFY_MIGRATION.md`** for detailed setup
2. **Set up AWS RDS** PostgreSQL database
3. **Migrate data** from Vercel Postgres
4. **Create Amplify app** and connect repository
5. **Test thoroughly** on Amplify
6. **Switch when ready**

---

**Both platforms are configured and ready!** 🎉
