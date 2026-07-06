import { PageHead } from '@/components/page-head';
import { Icon } from '@/components/icon';

const meta: Record<string, { title: string; sub: string; icon: string }> = {
  categories:     { title: 'Categories',           sub: 'Manage product categories and hierarchy',        icon: 'grid' },
  brands:         { title: 'Brands',                sub: 'Manage product brands and manufacturers',       icon: 'tag' },
  coupons:        { title: 'Coupons & Discounts',   sub: 'Create and manage promotional codes',           icon: 'gift' },
  'service-inq':  { title: 'Service Enquiries',     sub: 'All engineering service requests',              icon: 'tool' },
  banners:        { title: 'Banners & Promotions',  sub: 'Manage homepage and category banners',          icon: 'image' },
  pages:          { title: 'Static Pages',          sub: 'About, FAQ, Returns Policy and more',           icon: 'file' },
  blog:           { title: 'Blog',                  sub: 'Publish engineering articles and guides',       icon: 'edit' },
  media:          { title: 'Media Library',         sub: 'Manage uploaded images and files',              icon: 'image' },
  users:          { title: 'Admin Users',           sub: 'Manage staff accounts and permissions',         icon: 'users' },
  'training-inq': { title: 'Training Enquiries',    sub: 'Course and workshop enquiries from customers',  icon: 'book' },
  shipping:       { title: 'Shipping Zones',        sub: 'Configure delivery regions and rates',          icon: 'truck' },
  logs:           { title: 'Activity Logs',         sub: 'Audit trail of admin actions',                  icon: 'list' },
};

export default function AdminSlug({ params }: { params: { slug: string } }) {
  const info = meta[params.slug] ?? { title: params.slug, sub: 'Management page', icon: 'settings' };
  return (
    <div>
      <PageHead title={info.title} sub={info.sub}
        actions={<button className="btn btn-primary"><Icon name="plus" size={16} />Add New</button>} />
      <div className="card card-pad" style={{ textAlign: 'center', padding: '80px 40px' }}>
        <div style={{ fontSize: 48, marginBottom: 16, color: 'var(--line)' }}>
          <Icon name={info.icon as 'settings'} size={56} color="var(--line)" />
        </div>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{info.title}</div>
        <div className="sub">This section is ready to be connected to the database via Prisma.</div>
      </div>
    </div>
  );
}
