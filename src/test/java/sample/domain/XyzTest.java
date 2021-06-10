package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class XyzTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Xyz.class);
        Xyz xyz1 = new Xyz();
        xyz1.setId(1L);
        Xyz xyz2 = new Xyz();
        xyz2.setId(xyz1.getId());
        assertThat(xyz1).isEqualTo(xyz2);
        xyz2.setId(2L);
        assertThat(xyz1).isNotEqualTo(xyz2);
        xyz1.setId(null);
        assertThat(xyz1).isNotEqualTo(xyz2);
    }
}
