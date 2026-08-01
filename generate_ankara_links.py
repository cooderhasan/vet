import pandas as pd
import re
import html
import json

# Read Excel file
df = pd.read_excel('vet_ankara.xlsx')

def clean_phone(phone_val):
    if pd.isna(phone_val):
        return None
    s = str(phone_val).strip()
    digits = re.sub(r'\D', '', s)
    if not digits:
        return None
    if digits.startswith('90') and len(digits) == 12:
        return '+' + digits
    if digits.startswith('0') and len(digits) == 11:
        return '+90' + digits[1:]
    if len(digits) == 10:
        return '+90' + digits
    return '+' + digits

def get_district(row):
    addr = str(row.get('address', ''))
    city = str(row.get('city', ''))
    
    m = re.search(r'([A-Za-zÇĞİÖŞÜçğıöşü]+)/(?:Ankara|ANKARA)', addr)
    if m:
        return m.group(1).title()
        
    districts = ['Çankaya', 'Yenimahalle', 'Keçiören', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ', 'Gölbaşı', 'Pursaklar', 'Polatlı', 'Çubuk', 'Kahramankazan', 'Beypazarı', 'Elmadağ', 'Akyurt', 'Haymana', 'Kızılcahamam']
    for d in districts:
        if d.lower() in addr.lower():
            return d
            
    if city and city.lower() != 'ankara' and 'ankara' not in city.lower():
        return city.title()
        
    return 'Ankara (Merkez)'

clinics = []
districts_set = set()

for idx, row in df.iterrows():
    title = str(row.get('title', '')).strip()
    if not title:
        continue
    
    address = str(row.get('address', '')).strip() if pd.notna(row.get('address')) else ''
    city = str(row.get('city', '')).strip() if pd.notna(row.get('city')) else ''
    district = get_district(row)
    districts_set.add(district)
    
    raw_phone = str(row.get('phone', '')).strip() if pd.notna(row.get('phone')) else ''
    phone_cleaned = clean_phone(raw_phone)
    
    website = str(row.get('website', '')).strip() if pd.notna(row.get('website')) else ''
    total_score = str(row.get('totalScore', '')) if pd.notna(row.get('totalScore')) else ''
    reviews_count = str(row.get('reviewsCount', '')) if pd.notna(row.get('reviewsCount')) else ''
    
    clinics.append({
        'id': idx + 1,
        'title': title,
        'district': district,
        'address': address,
        'phone_raw': raw_phone,
        'phone_clean': phone_cleaned,
        'website': website,
        'score': total_score,
        'reviews': reviews_count
    })

districts_sorted = sorted(list(districts_set))

html_template = """<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ankara Veteriner Kliniği - WhatsApp Toplu Mesaj Gönderim Paneli</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #0f2928;
            --primary-light: #184240;
            --accent: #25d366;
            --accent-hover: #128c7e;
            --bg: #f4f7f6;
            --card: #ffffff;
            --text-dark: #1e293b;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --danger: #ef4444;
            --warning: #f59e0b;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }

        body {
            background-color: var(--bg);
            color: var(--text-dark);
            padding: 30px 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 1280px;
            margin: 0 auto;
        }

        .header-card {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
            color: white;
            padding: 32px;
            border-radius: 24px;
            box-shadow: 0 10px 30px rgba(15, 41, 40, 0.15);
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }

        .header-info h1 {
            font-size: 26px;
            font-weight: 800;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .header-info p {
            color: #a7f3d0;
            font-size: 14px;
            max-width: 650px;
            line-height: 1.5;
        }

        .stats-pills {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .stat-badge {
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(10px);
            padding: 10px 18px;
            border-radius: 14px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            text-align: center;
        }

        .stat-badge .val {
            font-size: 20px;
            font-weight: 800;
            color: #ffffff;
            display: block;
        }

        .stat-badge .lbl {
            font-size: 11px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }

        /* Progress Bar */
        .progress-card {
            background: white;
            padding: 20px 24px;
            border-radius: 18px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
            margin-bottom: 24px;
            border: 1px solid var(--border);
        }

        .progress-header {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 10px;
            color: var(--primary);
        }

        .progress-track {
            height: 12px;
            background: #e2e8f0;
            border-radius: 10px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #10b981 0%, #25d366 100%);
            border-radius: 10px;
            transition: width 0.4s ease;
        }

        /* Settings Panel */
        .settings-panel {
            background: white;
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 24px;
            border: 1px solid var(--border);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
        }

        .panel-title {
            font-size: 16px;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .settings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 16px;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .input-group label {
            font-size: 11px;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .input-ctrl {
            border: 1.5px solid var(--border);
            border-radius: 10px;
            padding: 10px 14px;
            font-size: 13.5px;
            outline: none;
            transition: all 0.2s;
            background: #f8fafc;
        }

        .input-ctrl:focus {
            border-color: var(--primary);
            background: white;
            box-shadow: 0 0 0 3px rgba(15, 41, 40, 0.08);
        }

        /* Template Area */
        .template-card {
            background: white;
            border-radius: 20px;
            padding: 20px 24px;
            margin-bottom: 24px;
            border: 1px solid var(--border);
        }

        .template-card summary {
            font-weight: 700;
            color: var(--primary);
            cursor: pointer;
            outline: none;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .preset-buttons {
            display: flex;
            gap: 10px;
            margin-top: 14px;
            margin-bottom: 12px;
            flex-wrap: wrap;
        }

        .btn-preset {
            background: #f1f5f9;
            color: #334155;
            border: 1px solid #cbd5e1;
            padding: 8px 14px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-preset:hover {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
        }

        .btn-preset.active {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
        }

        .template-editor {
            margin-top: 10px;
        }

        textarea.input-ctrl {
            width: 100%;
            height: 140px;
            resize: vertical;
            line-height: 1.5;
            font-family: inherit;
        }

        /* Controls / Filter Bar */
        .controls-bar {
            background: white;
            padding: 20px 24px;
            border-radius: 20px;
            margin-bottom: 24px;
            border: 1px solid var(--border);
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
            align-items: center;
            justify-content: space-between;
        }

        .filters-left {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            flex: 1;
            min-width: 300px;
        }

        .search-box {
            position: relative;
            flex: 1;
            min-width: 220px;
        }

        .search-box input {
            width: 100%;
            padding-left: 38px;
        }

        .search-box::before {
            content: "🔍";
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 14px;
            opacity: 0.5;
        }

        .btn-next-action {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            padding: 12px 22px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
            transition: all 0.2s ease;
        }

        .btn-next-action:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(16, 185, 129, 0.35);
        }

        /* Table Design */
        .table-card {
            background: white;
            border-radius: 20px;
            border: 1px solid var(--border);
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }

        th {
            background: #f8fafc;
            color: var(--text-muted);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border);
            font-weight: 700;
        }

        td {
            padding: 16px 20px;
            border-bottom: 1px solid var(--border);
            vertical-align: middle;
            font-size: 13.5px;
        }

        tr:last-child td { border-bottom: none; }
        tr:hover { background-color: #f8fafc; }
        tr.row-sent { background-color: #f0fdf4; }

        .clinic-name {
            font-weight: 700;
            color: var(--primary);
            font-size: 14px;
            display: block;
            margin-bottom: 4px;
        }

        .clinic-sub {
            font-size: 12px;
            color: var(--text-muted);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .badge-district {
            background: #e2e8f0;
            color: #334155;
            font-size: 11px;
            padding: 3px 10px;
            border-radius: 8px;
            font-weight: 600;
        }

        .phone-num {
            font-family: monospace;
            font-size: 13px;
            font-weight: 600;
            color: #334155;
        }

        .actions-cell {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-wa {
            background-color: var(--accent);
            color: white;
            text-decoration: none;
            padding: 9px 16px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 12.5px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
            border: none;
            cursor: pointer;
        }

        .btn-wa:hover {
            background-color: var(--accent-hover);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
        }

        .btn-disabled {
            background-color: #e2e8f0;
            color: #94a3b8;
            cursor: not-allowed;
            pointer-events: none;
        }

        .btn-copy {
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #cbd5e1;
            padding: 9px 12px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-copy:hover {
            background: #e2e8f0;
            color: var(--primary);
        }

        .checkbox-sent {
            width: 18px;
            height: 18px;
            accent-color: var(--accent);
            cursor: pointer;
        }

        .badge-status {
            font-size: 11px;
            padding: 4px 10px;
            border-radius: 10px;
            font-weight: 700;
        }

        .status-ready { background-color: #dcfce7; color: #166534; }
        .status-missing { background-color: #fee2e2; color: #991b1b; }
        .status-sent { background-color: #e0f2fe; color: #075985; }

        /* Responsive */
        @media (max-width: 768px) {
            body { padding: 15px 10px; }
            .header-card { padding: 20px; text-align: center; justify-content: center; }
            .stats-pills { justify-content: center; width: 100%; }
            th, td { padding: 10px 12px; }
            .actions-cell { flex-direction: column; align-items: stretch; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Card -->
        <div class="header-card">
            <div class="header-info">
                <h1>🐾 Ankara Veteriner Kliniği WhatsApp Paneli</h1>
                <p>Ankara'daki tüm veteriner kliniklerine sırayla WhatsApp mesajı gönderin, durumlarını takip edin ve gönderilenleri işaretleyin.</p>
            </div>
            <div class="stats-pills">
                <div class="stat-badge">
                    <span class="val" id="stat_total">0</span>
                    <span class="lbl">Toplam Klinik</span>
                </div>
                <div class="stat-badge">
                    <span class="val" id="stat_ready" style="color: #4ade80;">0</span>
                    <span class="lbl">İletişime Açık</span>
                </div>
                <div class="stat-badge">
                    <span class="val" id="stat_sent" style="color: #38bdf8;">0</span>
                    <span class="lbl">Gönderildi</span>
                </div>
                <div class="stat-badge">
                    <span class="val" id="stat_missing" style="color: #f87171;">0</span>
                    <span class="lbl">Telefon Eksik</span>
                </div>
            </div>
        </div>

        <!-- Progress Tracker Bar -->
        <div class="progress-card">
            <div class="progress-header">
                <span>Mesaj İlerleme Durumu</span>
                <span id="progress_text">0 / 0 (%0)</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" id="progress_fill"></div>
            </div>
        </div>

        <!-- Dynamic Settings Panel -->
        <div class="settings-panel">
            <div class="panel-title">⚙️ Gönderen & Link Ayarları</div>
            <div class="settings-grid">
                <div class="input-group">
                    <label for="live_url">Canlı Yayın / Vercel Linkiniz</label>
                    <input type="text" id="live_url" value="https://vet-roan-delta.vercel.app" class="input-ctrl">
                </div>
                <div class="input-group">
                    <label for="my_phone">İletişim Telefonunuz</label>
                    <input type="text" id="my_phone" value="05418571873" class="input-ctrl">
                </div>
                <div class="input-group">
                    <label for="my_email">İletişim E-Postanız</label>
                    <input type="text" id="my_email" value="cooderhasan@gmail.com" class="input-ctrl">
                </div>
                <div class="input-group">
                    <label for="my_name">Adınız Soyadınız</label>
                    <input type="text" id="my_name" value="Hasan Durmuş" class="input-ctrl">
                </div>
            </div>
        </div>

        <!-- Collapsible Template Editor -->
        <details class="template-card" open>
            <summary>📝 WhatsApp Mesaj Şablonu (Kişiselleştirilebilir)</summary>
            
            <div class="preset-buttons">
                <button class="btn-preset active" onclick="setPreset('short_hook')">✨ Kısa & Merak Uyandıran (Önerilen - İzin İsteme)</button>
                <button class="btn-preset" onclick="setPreset('short_link')">🔗 Kısa Linkli Şablon</button>
                <button class="btn-preset" onclick="setPreset('full_detail')">📋 Detaylı Özellik Listesi</button>
            </div>

            <div class="template-editor">
                <textarea id="msg_template" class="input-ctrl">Merhaba {clinic_name} / Hocam, iyi çalışmalar dilerim. 👋

Ankara'daki klinikler için geliştirdiğimiz yeni nesil Dijital Karne ve Otomatik Aşı Hatırlatma yazılımımızı 1 dakikalık inceleme linkiyle iletmemi ister misiniz?

İletişim: {my_phone}
Saygılarımla,
{my_name}</textarea>
            </div>
        </details>

        <!-- Controls & Filters -->
        <div class="controls-bar">
            <div class="filters-left">
                <div class="search-box">
                    <input type="text" id="search_input" class="input-ctrl" placeholder="Klinik adı veya adres ara...">
                </div>
                <select id="district_filter" class="input-ctrl">
                    <option value="">Tüm İlçeler</option>
"""

# Insert district options
for dist in districts_sorted:
    html_template += f'                    <option value="{html.escape(dist)}">{html.escape(dist)}</option>\n'

html_template += """                </select>
                <select id="status_filter" class="input-ctrl">
                    <option value="">Tüm Durumlar</option>
                    <option value="pending">Gönderilecekler (Bekleyen)</option>
                    <option value="sent">Gönderilenler</option>
                    <option value="ready">Telefonu Olanlar</option>
                    <option value="missing">Telefonu Eksik Olanlar</option>
                </select>
            </div>
            <button class="btn-next-action" onclick="openNextUnsent()">🚀 Sıradaki WhatsApp Mesajını Aç</button>
        </div>

        <!-- Table -->
        <div class="table-card">
            <table>
                <thead>
                    <tr>
                        <th style="width: 50px; text-align: center;">Durum</th>
                        <th style="width: 50px;">Sıra</th>
                        <th>Klinik Adı / İlçe</th>
                        <th>Telefon</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody id="clinics_tbody">
"""

# Render table rows
for c in clinics:
    cid = c['id']
    title_esc = html.escape(c['title'])
    district_esc = html.escape(c['district'])
    addr_esc = html.escape(c['address'])
    phone_raw = c['phone_raw']
    phone_clean = c['phone_clean']
    
    status_class = 'status-ready' if phone_clean else 'status-missing'
    status_text = 'Hazır' if phone_clean else 'Telefon Yok'
    
    html_template += f"""                    <tr data-id="{cid}" data-title="{title_esc}" data-district="{district_esc}" data-phone="{phone_clean or ''}" data-hasphone="{'1' if phone_clean else '0'}">
                        <td style="text-align: center;">
                            <input type="checkbox" class="checkbox-sent" onchange="toggleSent({cid}, this.checked)">
                        </td>
                        <td><strong>{cid}</strong></td>
                        <td>
                            <span class="clinic-name">{title_esc}</span>
                            <div class="clinic-sub">
                                <span class="badge-district">{district_esc}</span>
                                <span title="{addr_esc}">{addr_esc[:50] + ('...' if len(addr_esc)>50 else '')}</span>
                            </div>
                        </td>
                        <td>
"""
    if phone_clean:
        html_template += f'                            <span class="phone-num">{phone_raw or phone_clean}</span>\n'
    else:
        html_template += '                            <span class="badge-status status-missing">Telefon Yok</span>\n'
        
    html_template += f"""                        </td>
                        <td>
                            <div class="actions-cell">
"""
    if phone_clean:
        html_template += f"""                                <a href="#" target="_blank" class="btn-wa" data-phone="{phone_clean}" data-title="{title_esc}" onclick="markAsSent({cid})">💬 WhatsApp Gönder</a>
                                <button class="btn-copy" onclick="copyMessage('{phone_clean}', '{title_esc}')">📋 Kopyala</button>
"""
    else:
        html_template += """                                <button class="btn-wa btn-disabled">⚠️ Telefon Eksik</button>
"""
    html_template += """                            </div>
                        </td>
                    </tr>
"""

html_template += """                </tbody>
            </table>
        </div>
    </div>

    <script>
        const clinicsData = """ + json.dumps(clinics, ensure_ascii=False) + """;

        const PRESETS = {
            short_hook: `Merhaba {clinic_name} / Hocam, iyi çalışmalar dilerim. 👋\\n\\nAnkara'daki klinikler için geliştirdiğimiz yeni nesil Dijital Karne ve Otomatik Aşı Hatırlatma yazılımımızı 1 dakikalık inceleme linkiyle iletmemi ister misiniz?\\n\\nİletişim: {my_phone}\\nSaygılarımla,\\n{my_name}`,
            
            short_link: `Merhaba {clinic_name} / Hocam, iyi çalışmalar dilerim. 🐾\\n\\nVeteriner klinikleri için tasarladığımız Dijital Karne Portalını incelemek isterseniz:\\n🔗 Web Sitesi: {frontend_url}\\n🔗 Karne Portalı: {frontend_url}/karne\\n\\nDetaylı bilgi için: {my_phone}\\nSaygılarımla, {my_name}`,
            
            full_detail: `Merhaba {clinic_name} / Hocam, iyi çalışmalar dilerim. 🐾\\n\\nVeteriner klinikleri için özel olarak tasarladığımız modern ve premium klinik yönetim sistemi + dijital karne portalını tamamladık!\\n\\nSistemimizin temel özellikleri:\\n1. 💻 Premium Ön Yüz Web Sitesi: Hizmetleriniz ve 7/24 AI Asistan hizmetiniz.\\n2. 🗂️ Dijital Hasta Kartları (EMR): Tıbbi geçmiş ve aşı takvimleri.\\n3. 📱 Müşteri Portalı (Pet Karnesi): Hasta sahiplerinin aşı ve rapor takibi.\\n4. 🏨 Pet Oteli: Odaların doluluk ve konaklama takibi.\\n5. 📊 Finans & Muhasebe: Ciro ve kasa takibi.\\n6. 🔔 WhatsApp Bildirimi: Tek tıkla aşı hatırlatma.\\n\\nBağlantılar:\\n• Web Sitesi: {frontend_url}\\n• Yönetim Paneli: {admin_url}\\n\\nİletişim: {my_phone} | {my_email}\\nSaygılarımla, {my_name}`
        };

        function setPreset(presetKey) {
            if (PRESETS[presetKey]) {
                document.getElementById("msg_template").value = PRESETS[presetKey];
                
                document.querySelectorAll(".btn-preset").forEach(btn => btn.classList.remove("active"));
                event.target.classList.add("active");
                
                updateLinks();
            }
        }

        function getSentMap() {
            try {
                return JSON.parse(localStorage.getItem("ankara_vet_wa_sent") || "{}");
            } catch(e) {
                return {};
            }
        }

        function saveSentMap(map) {
            localStorage.setItem("ankara_vet_wa_sent", JSON.stringify(map));
        }

        function markAsSent(id) {
            const map = getSentMap();
            map[id] = true;
            saveSentMap(map);
            updateUI();
        }

        function toggleSent(id, isChecked) {
            const map = getSentMap();
            if (isChecked) {
                map[id] = true;
            } else {
                delete map[id];
            }
            saveSentMap(map);
            updateUI();
        }

        function getMessageText(clinicTitle) {
            const template = document.getElementById("msg_template").value;
            const liveUrl = document.getElementById("live_url").value.trim().replace(new RegExp('/$'), "");
            const myPhone = document.getElementById("my_phone").value.trim();
            const myEmail = document.getElementById("my_email").value.trim();
            const myName = document.getElementById("my_name").value.trim();

            const frontendUrl = liveUrl;
            const adminUrl = liveUrl + "/admin";

            return template
                .replace(/{clinic_name}/g, clinicTitle || "Veteriner Kliniği")
                .replace(/{frontend_url}/g, frontendUrl)
                .replace(/{admin_url}/g, adminUrl)
                .replace(/{my_phone}/g, myPhone)
                .replace(/{my_email}/g, myEmail)
                .replace(/{my_name}/g, myName);
        }

        function updateLinks() {
            document.querySelectorAll(".btn-wa[data-phone]").forEach(btn => {
                const phone = btn.getAttribute("data-phone");
                const title = btn.getAttribute("data-title");
                if (phone) {
                    const msgText = getMessageText(title);
                    btn.href = "https://api.whatsapp.com/send?phone=" + phone + "&text=" + encodeURIComponent(msgText);
                }
            });
        }

        function copyMessage(phone, title) {
            const msgText = getMessageText(title);
            navigator.clipboard.writeText(msgText).then(() => {
                alert("'" + title + "' için hazırlanan mesaj metni panoya kopyalandı!");
            }).catch(err => {
                console.error("Kopyalama hatası:", err);
            });
        }

        function updateUI() {
            const sentMap = getSentMap();
            const search = document.getElementById("search_input").value.toLowerCase().trim();
            const district = document.getElementById("district_filter").value;
            const statusFilter = document.getElementById("status_filter").value;

            let totalCount = 0;
            let readyCount = 0;
            let missingCount = 0;
            let sentCount = 0;

            const rows = document.querySelectorAll("#clinics_tbody tr");

            rows.forEach(row => {
                const id = parseInt(row.getAttribute("data-id"));
                const rowDistrict = row.getAttribute("data-district");
                const hasPhone = row.getAttribute("data-hasphone") === "1";
                const isSent = !!sentMap[id];
                const textContent = row.textContent.toLowerCase();

                totalCount++;
                if (hasPhone) readyCount++;
                else missingCount++;
                if (isSent) sentCount++;

                // Checkbox sync
                const checkbox = row.querySelector(".checkbox-sent");
                if (checkbox) checkbox.checked = isSent;

                if (isSent) {
                    row.classList.add("row-sent");
                } else {
                    row.classList.remove("row-sent");
                }

                // Filtering logic
                let matchesSearch = !search || textContent.includes(search);
                let matchesDistrict = !district || rowDistrict === district;
                let matchesStatus = true;

                if (statusFilter === "pending") {
                    matchesStatus = hasPhone && !isSent;
                } else if (statusFilter === "sent") {
                    matchesStatus = isSent;
                } else if (statusFilter === "ready") {
                    matchesStatus = hasPhone;
                } else if (statusFilter === "missing") {
                    matchesStatus = !hasPhone;
                }

                if (matchesSearch && matchesDistrict && matchesStatus) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });

            // Update Header Stats
            document.getElementById("stat_total").textContent = totalCount;
            document.getElementById("stat_ready").textContent = readyCount;
            document.getElementById("stat_sent").textContent = sentCount;
            document.getElementById("stat_missing").textContent = missingCount;

            // Update Progress Bar
            const percent = readyCount > 0 ? Math.round((sentCount / readyCount) * 100) : 0;
            document.getElementById("progress_text").textContent = sentCount + " / " + readyCount + " (% " + percent + ")";
            document.getElementById("progress_fill").style.width = percent + "%";

            // Update WA links with current inputs
            updateLinks();
        }

        function openNextUnsent() {
            const sentMap = getSentMap();

            const rows = document.querySelectorAll("#clinics_tbody tr");
            for (let row of rows) {
                if (row.style.display === "none") continue;

                const id = parseInt(row.getAttribute("data-id"));
                const hasPhone = row.getAttribute("data-hasphone") === "1";
                const phone = row.getAttribute("data-phone");
                const title = row.getAttribute("data-title");
                const isSent = !!sentMap[id];

                if (hasPhone && !isSent && phone) {
                    const msgText = getMessageText(title);
                    markAsSent(id);
                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    window.open("https://api.whatsapp.com/send?phone=" + phone + "&text=" + encodeURIComponent(msgText), "_blank");
                    return;
                }
            }

            alert("Tebrikler! Filtrelenen listede gönderilecek başka klinik kalmadı 🎉");
        }

        // Attach Event Listeners
        document.getElementById("live_url").addEventListener("input", updateLinks);
        document.getElementById("my_phone").addEventListener("input", updateLinks);
        document.getElementById("my_email").addEventListener("input", updateLinks);
        document.getElementById("my_name").addEventListener("input", updateLinks);
        document.getElementById("msg_template").addEventListener("input", updateLinks);

        document.getElementById("search_input").addEventListener("input", updateUI);
        document.getElementById("district_filter").addEventListener("change", updateUI);
        document.getElementById("status_filter").addEventListener("change", updateUI);

        // Initial Load
        updateUI();
    </script>
</body>
</html>
"""

with open('whatsapp_links.html', 'w', encoding='utf-8') as f:
    f.write(html_template)

with open('whatsapp_links_ankara.html', 'w', encoding='utf-8') as f:
    f.write(html_template)

print("Successfully updated whatsapp_links.html and whatsapp_links_ankara.html with short engaging template!")
