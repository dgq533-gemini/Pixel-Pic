export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">隐私政策</h1>
      <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
        <p>
          <strong>图片处理：</strong>
          Pixel-Pic 所有图片处理均在你的浏览器本地完成，图片不会上传到我们的服务器，
          也不会被存储或分享。
        </p>
        <p>
          <strong>数据收集：</strong>
          我们不收集任何个人身份信息。网站可能使用匿名访问统计来改进服务，
          这些数据不包含可识别个人身份的内容。
        </p>
        <p>
          <strong>Cookie：</strong>
          本网站不使用追踪型 Cookie。浏览器本地存储仅用于保存你的使用偏好。
        </p>
        <p>
          <strong>广告：</strong>
          页面中的广告位为预留位置，将来接入广告网络时可能会使用 Cookie 进行投放。
          届时将更新本政策。
        </p>
      </div>
    </div>
  );
}
